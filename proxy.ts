import {
  ADMIN_ROUTES,
  isAuthPage,
  PRIVATE_ROUTES,
  PUBLIC_ROUTES,
} from "@/config/routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { refreshTokens } from "./actions/auth"
import { protectAdmin } from "./actions/protectAdmin"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth"

export async function proxy(request: NextRequest) {
  let accessToken = request.cookies.get(ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value

  const { pathname } = request.nextUrl
  const isAuth = isAuthPage(pathname)

  if (!accessToken && refreshToken) {
    const response = await refreshTokens()
    if (!response.success) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
    } else {
      accessToken = response.accessToken
    }
  }

  if (!refreshToken && !isAuth) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }

  if (accessToken && refreshToken && isAuth) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  if (pathname.startsWith(ADMIN_ROUTES.HOME)) {
    if (accessToken) {
      const adminCheck = await protectAdmin(request, accessToken)
      if (adminCheck) return adminCheck
    } else {
      return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
