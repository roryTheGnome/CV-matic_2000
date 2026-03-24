import { isAuthPage, PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/config/routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth"

export function proxy(request: NextRequest) {
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN)
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN)
  const hasSession = hasAccessToken || hasRefreshToken

  const { pathname } = request.nextUrl
  const isAuth = isAuthPage(pathname)

  if (!hasSession && !isAuth) {
    const loginUrl = new URL(PUBLIC_ROUTES.LOGIN, request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (hasSession && isAuth) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
