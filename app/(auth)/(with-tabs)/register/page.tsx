import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthForm } from "../../_components/AuthForm"
import { AuthHeading } from "../../_components/AuthHeading"
import { AuthLink } from "../../_components/AuthLink"

export default function Register() {
  return (
    <>
      <AuthHeading
        title="Register now"
        subtitle="Welcome! Sign up to continue"
      />
      <AuthForm />

      <AuthLink text="I have an account" href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}
