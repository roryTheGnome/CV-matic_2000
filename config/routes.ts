export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const

export const PRIVATE_ROUTES = {
  HOME: "/",

  USERS: "/users",
  CVS: "/cvs",
  LANGUAGES: "/languages",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  SKILLS: "/skills",
} as const

export const ADMIN_ROUTES = {
  PROJECTS: "/admin/projects",
  DEPARTMENTS: "/admin/departments",
  POSITIONS: "/admin/positions",
} as const

export const isAuthPage = (pathname: string) => {
  return [
    PUBLIC_ROUTES.LOGIN,
    PUBLIC_ROUTES.REGISTER,
    PUBLIC_ROUTES.FORGOT_PASSWORD,
    PUBLIC_ROUTES.RESET_PASSWORD,
  ].some(route => pathname.startsWith(route))
}
