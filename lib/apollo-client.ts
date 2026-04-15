import { getAccessToken, refreshTokens } from '@/actions/auth'
import { isAuthPage, PUBLIC_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/authStore'
import { RefreshTokenResult } from '@/types/auth'
import {
  ApolloClient,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
  Observable,
  ServerError,
} from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
})

let refreshTokenPromise: Promise<RefreshTokenResult> | null = null

const authLink = new SetContextLink(async (prevContext) => {
  if (typeof window !== 'undefined' && isAuthPage(window.location.pathname)) {
    return { headers: prevContext.headers }
  }

  const token = await getAccessToken()

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  let isUnauthorized = false

  if (CombinedGraphQLErrors.is(error)) {
    isUnauthorized = error.errors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED',
    )
  } else if (ServerError.is(error)) {
    isUnauthorized = error.statusCode === 401
  }

  if (isUnauthorized) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokens().finally(() => {
        refreshTokenPromise = null
      })
    }

    return new Observable((observer) => {
      refreshTokenPromise!
        .then((result) => {
          if (!result?.success || !result.accessToken) {
            useAuthStore.getState().logout()

            if (typeof window !== 'undefined') {
              window.location.href = PUBLIC_ROUTES.LOGIN
            }
            return observer.error(new Error('Session expired'))
          }

          useAuthStore.getState().setFromToken(result.accessToken)

          const oldHeaders = operation.getContext().headers
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${result.accessToken}`,
            },
          })

          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          }

          forward(operation).subscribe(subscriber)
        })
        .catch((err) => {
          observer.error(err)
        })
    })
  }
})

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          profile: {
            merge(existing, incoming) {
              if (!existing) return incoming
              return { ...existing, ...incoming }
            },
          },
        },
      },
    },
  }),
})
