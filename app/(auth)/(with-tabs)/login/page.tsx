import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthForm } from "../_components/AuthForm"
import { AuthLink } from "../_components/AuthLink"

export default function Login() {
  return (
    <>
      <div className="mb-10">
        <h1 className="font-normal">Welcome back</h1>
        <span>Hello again! Log in to continue</span>
      </div>
      <AuthForm />
      <AuthLink text="Forgot password" href={PUBLIC_ROUTES.FORGOT_PASSWORD} />
    </>
  )
}
