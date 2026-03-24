import { setAuthTokens } from "@/actions/auth"
import { SIGNUP_MUTATION } from "@/api/graphql/mutations/auth"
import { LOGIN_QUERY } from "@/api/graphql/queries/auth"
import {
  LoginResponse,
  LoginVariables,
  SignupResponse,
} from "@/api/graphql/types/auth"
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/config/routes"
import { ErrorLike } from "@apollo/client"
import { useLazyQuery, useMutation } from "@apollo/client/react"

import { usePathname, useRouter } from "next/navigation"
import { SubmitEvent } from "react"

export const useAuthForm = () => {
  const [loginFn, { loading: loginLoading, error: loginError }] = useLazyQuery<
    LoginResponse,
    LoginVariables
  >(LOGIN_QUERY)

  const [signupFn, { loading: signupLoading, error: signupError }] =
    useMutation<SignupResponse, LoginVariables>(SIGNUP_MUTATION)

  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === PUBLIC_ROUTES.LOGIN
  const isLoading = loginLoading || signupLoading
  const currentError: ErrorLike | undefined = loginError || signupError

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const email = formatData.get("email") as string
    const password = formatData.get("password") as string

    try {
      if (isLogin) {
        const { data } = await loginFn({
          variables: {
            auth: { email, password },
          },
        })

        if (data?.login) {
          await setAuthTokens(data.login.access_token, data.login.refresh_token)

          router.push(PRIVATE_ROUTES.HOME)
        }
      } else {
        const { data } = await signupFn({
          variables: {
            auth: { email, password },
          },
        })

        if (data?.signup) {
          await setAuthTokens(
            data.signup.access_token,
            data.signup.refresh_token,
          )

          router.push(PRIVATE_ROUTES.HOME)
        }
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error)
    }
  }

  return {
    pathname,
    isLoading,
    currentError,
    handleSubmit,
  }
}
