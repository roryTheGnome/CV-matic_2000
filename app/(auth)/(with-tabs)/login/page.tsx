import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthForm } from "../../_components/AuthForm"
import { AuthHeading } from "../../_components/AuthHeading"
import { AuthLink } from "../../_components/AuthLink"

export default function Login() {
  return (
    <>
      <AuthHeading
        title="Welcome back"
        subtitle="Hello again! Log in to continue"
      />

      <AuthForm />
      <AuthLink text="Forgot password" href={PUBLIC_ROUTES.FORGOT_PASSWORD} />
    </>
  )
}
