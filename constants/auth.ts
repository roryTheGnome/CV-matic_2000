export const ACCESS_TOKEN = 'accessToken'
export const REFRESH_TOKEN = 'refreshToken'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}
