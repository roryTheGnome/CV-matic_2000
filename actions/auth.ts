'use server'

import { RefreshTokenResult, UpdateTokenResonse } from '@/types/auth'
import { cookies } from 'next/headers'
const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'

export async function setAuthTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const cookieStore = await cookies()

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60,
  })

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function removeAuthTokens(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN)
  cookieStore.delete(REFRESH_TOKEN)
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  return token
}

export async function refreshTokens(): Promise<RefreshTokenResult> {
  const cookiesStore = await cookies()
  const refresh = cookiesStore.get(REFRESH_TOKEN)?.value

  if (!refresh) {
    await removeAuthTokens()
    return { success: false, message: 'No refresh token available' }
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refresh}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation UpdateToken {
            updateToken {
              access_token
              refresh_token
            }
          }
        `,
      }),
    })

    const result = await response.json()
    if (result.errors) {
      await removeAuthTokens()
      return { success: false, message: result.errors[0].message }
    }

    const { access_token, refresh_token }: UpdateTokenResonse =
      result.data?.updateToken

    if (!access_token || !refresh_token) {
      await removeAuthTokens()
      return { success: false, message: 'Refresh token is invalid or expired' }
    }

    await setAuthTokens(access_token, refresh_token)

    return { success: true, accessToken: access_token }
  } catch (error) {
    console.error('Refresh token error:', error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Network error during refresh',
    }
  }
}
