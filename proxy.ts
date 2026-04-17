import { isAuthPage, PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/config/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { fetchNewTokens } from './actions/auth'
import { ACCESS_TOKEN, COOKIE_OPTIONS, REFRESH_TOKEN } from './constants/auth'

export async function proxy(request: NextRequest) {
  let accessToken = request.cookies.get(ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value

  const responseObj = NextResponse.next()
  const { pathname } = request.nextUrl

  if (!accessToken && refreshToken) {
    const response = await fetchNewTokens(refreshToken)

    if (!response.success || !response.accessToken || !response.refreshToken) {
      const redirectResponse = NextResponse.redirect(
        new URL(PUBLIC_ROUTES.LOGIN, request.url),
      )
      redirectResponse.cookies.delete(ACCESS_TOKEN)
      redirectResponse.cookies.delete(REFRESH_TOKEN)
      return redirectResponse
    } else {
      accessToken = response.accessToken

      responseObj.cookies.set(ACCESS_TOKEN, response.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60,
      })
      responseObj.cookies.set(REFRESH_TOKEN, response.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  }

  if (!refreshToken && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }

  if (accessToken && refreshToken && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES.HOME, request.url))
  }

  return responseObj
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
