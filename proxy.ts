import { isAuthPage, PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/config/routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ACCESS_TOKEN } from "./constants/auth"

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN)?.value
  const { pathname } = request.nextUrl

  if (!token && !isAuthPage(pathname)) {
    const loginUrl = new URL(PUBLIC_ROUTES.LOGIN, request.url)

    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
