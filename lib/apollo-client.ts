import { getAccessToken, refreshTokens } from "@/actions/auth"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
})

let refreshTokenPromise: Promise<{
  success: boolean
  accessToken?: string
  message?: string
}> | null = null

const authLink = new SetContextLink(async (prevContext, operation) => {
  let token = await getAccessToken()

  if (!token) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokens().finally(() => {
        refreshTokenPromise = null
      })
    }

    const newToken = await refreshTokenPromise

    if (newToken?.accessToken) {
      token = newToken.accessToken
    }
  }
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
