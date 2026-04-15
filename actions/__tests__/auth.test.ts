import { cookies } from 'next/headers'
import {
  getAccessToken,
  refreshTokens,
  removeAuthTokens,
  setAuthTokens,
} from '../auth'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

const mockCookies = cookies as jest.Mock

describe('Auth Server Actions', () => {
  const mockSet = jest.fn()
  const mockDelete = jest.fn()
  const mockGet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_GRAPHQL_URL = 'http://localhost:3001/api/graphql'

    mockCookies.mockResolvedValue({
      set: mockSet,
      delete: mockDelete,
      get: mockGet,
    })

    global.fetch = jest.fn()
  })

  describe('setAuthTokens', () => {
    it('should set access and refresh tokens with correct options', async () => {
      await setAuthTokens('access-val', 'refresh-val')

      expect(mockSet).toHaveBeenCalledWith(
        'accessToken',
        'access-val',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          maxAge: 3600,
        }),
      )
      expect(mockSet).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-val',
        expect.objectContaining({
          maxAge: 604800,
        }),
      )
    })
  })

  describe('removeAuthTokens', () => {
    it('should delete both tokens from cookies', async () => {
      await removeAuthTokens()

      expect(mockDelete).toHaveBeenCalledWith('accessToken')
      expect(mockDelete).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('getAccessToken', () => {
    it('should return token value if it exists', async () => {
      mockGet.mockReturnValue({ value: 'found-token' })
      const result = await getAccessToken()
      expect(result).toBe('found-token')
    })

    it('should return undefined if token does not exist', async () => {
      mockGet.mockReturnValue(undefined)
      const result = await getAccessToken()
      expect(result).toBeUndefined()
    })
  })

  describe('refreshTokens', () => {
    it('should return failure if no refresh token is in cookies', async () => {
      mockGet.mockReturnValue(undefined)

      const result = await refreshTokens()

      expect(result).toEqual({
        success: false,
        message: 'No refresh token available',
      })
      expect(mockDelete).toHaveBeenCalled()
    })

    it('should return failure if fetch throws an error', async () => {
      mockGet.mockReturnValue({ value: 'existing-refresh' })
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network fail'))

      const result = await refreshTokens()

      expect(result.success).toBe(false)
    })

    it('should return failure if GraphQL returns errors', async () => {
      mockGet.mockReturnValue({ value: 'existing-refresh' })
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          errors: [{ message: 'Unauthorized' }],
        }),
      })

      const result = await refreshTokens()

      expect(result).toEqual({ success: false, message: 'Unauthorized' })
      expect(mockDelete).toHaveBeenCalled()
    })

    it('should return success and update cookies when mutation succeeds', async () => {
      mockGet.mockReturnValue({ value: 'old-refresh' })
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: {
            updateToken: {
              access_token: 'new-access',
              refresh_token: 'new-refresh',
            },
          },
        }),
      })

      const result = await refreshTokens()

      expect(result).toEqual({ success: true, accessToken: 'new-access' })
      expect(mockSet).toHaveBeenCalledWith(
        'accessToken',
        'new-access',
        expect.any(Object),
      )
      expect(mockSet).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh',
        expect.any(Object),
      )
    })

    it('should fail if access_token or refresh_token is missing in response', async () => {
      mockGet.mockReturnValue({ value: 'old-refresh' })
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: {
            updateToken: { access_token: null, refresh_token: null },
          },
        }),
      })

      const result = await refreshTokens()

      expect(result.success).toBe(false)
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
