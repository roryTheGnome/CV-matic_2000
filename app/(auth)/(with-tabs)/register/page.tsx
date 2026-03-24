import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthForm } from "../_components/AuthForm"
import { AuthLink } from "../_components/AuthLink"

export default function Register() {
  return (
    <>
      <div className="mb-10">
        <h1 className="font-normal">Register now</h1>
        <span>Welcome! Sign up to continue</span>
      </div>
      <AuthForm />

      <AuthLink text="I have an account" href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}
