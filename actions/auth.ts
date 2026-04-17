'use server'

import { COOKIE_OPTIONS } from '@/constants/auth'
import { RefreshTokenResult, UpdateTokenResonse } from '@/types/auth'
import { cookies } from 'next/headers'
const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'

export async function setAuthTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60,
  })

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function removeAuthTokens(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN)
  cookieStore.delete(REFRESH_TOKEN)
}

export async function fetchNewTokens(refresh: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refresh}`,
      },
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
      return { success: false, message: result.errors[0].message }
    }

    const { access_token, refresh_token }: UpdateTokenResonse =
      result.data?.updateToken

    if (!access_token || !refresh_token) {
      return { success: false, message: 'Refresh token is invalid or expired' }
    }

    return {
      success: true,
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Network error during refresh',
    }
  }
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

  const result = await fetchNewTokens(refresh)

  if (result.success && result.accessToken && result.refreshToken) {
    await setAuthTokens(result.accessToken, result.refreshToken)
    return { success: true, accessToken: result.accessToken }
  } else {
    await removeAuthTokens()
    return { success: false, message: result.message || 'Failed to refresh' }
  }
}
