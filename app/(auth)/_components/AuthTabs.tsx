import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthTab } from "./AuthTab"

export function AuthTabs() {
  return (
    <div className="absolute flex text-sm font-semibold tracking-wider w-full justify-center top-0 left-0">
      <AuthTab href={PUBLIC_ROUTES.LOGIN} name="Log in" />
      <AuthTab href={PUBLIC_ROUTES.REGISTER} name="Sign up" />
    </div>
  )
}
