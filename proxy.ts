import {
  isAdminPage,
  isAuthPage,
  PRIVATE_ROUTES,
  PUBLIC_ROUTES,
} from "@/config/routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { protectAdmin } from "./actions/protectAdmin"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth"

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN)
  const hasSession = accessToken || hasRefreshToken

  const { pathname } = request.nextUrl
  const isAuth = isAuthPage(pathname)

  if (!hasSession && !isAuth) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }

  if (hasSession && isAuth) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  if (isAdminPage(pathname) && accessToken) {
    protectAdmin(request, accessToken)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
