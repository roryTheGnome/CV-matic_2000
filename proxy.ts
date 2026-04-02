import {
  isAdminPage,
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

  const responseObj = NextResponse.next()

  const { pathname } = request.nextUrl

  if (!accessToken && refreshToken) {
    const response = await refreshTokens()
    if (!response.success) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
    } else {
      accessToken = response.accessToken
      responseObj.cookies.set(ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }
  }

  if (!refreshToken && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }

  if (accessToken && refreshToken && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  if (accessToken && isAdminPage(pathname)) {
    const adminCheck = await protectAdmin(request, accessToken)
    if (adminCheck) return adminCheck
  }

  return responseObj
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
