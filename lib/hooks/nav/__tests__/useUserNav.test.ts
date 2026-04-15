import { useUser } from '@/lib/hooks/userHooks/useUser'
import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { useUserNav } from '../useUserNav'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('../../userHooks/useUser.ts', () => ({
  useUser: jest.fn(),
}))

describe('useUserNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct navigation data when user is loaded', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/users/123/profile')
    ;(useUser as jest.Mock).mockReturnValue({
      user: { profile: { first_name: 'John', last_name: 'Doe' } },
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserNav())

    expect(result.current.user).toEqual({
      profile: { first_name: 'John', last_name: 'Doe' },
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.displayName).toBe('John Doe')
    expect(result.current.currentPiece).toBe('profile')
  })

  it('should return default display name and loading state when user is not available', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/users/123/settings')
    ;(useUser as jest.Mock).mockReturnValue({
      user: undefined,
      isLoading: true,
      error: undefined,
    })

    const { result } = renderHook(() => useUserNav())

    expect(result.current.user).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.displayName).toBe('Unnamed User')
    expect(result.current.currentPiece).toBe('settings')
  })

  it('should return error state when useUser encounters an error', () => {
    const mockError = new Error('Network Error')
    ;(usePathname as jest.Mock).mockReturnValue('/users/123/profile')
    ;(useUser as jest.Mock).mockReturnValue({
      user: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useUserNav())

    expect(result.current.error).toEqual(mockError)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.displayName).toBe('Unnamed User')
  })

  it('should correctly format labels using formatLabel', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/users/123/profile')
    ;(useUser as jest.Mock).mockReturnValue({
      user: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserNav())

    expect(result.current.formatLabel('profile')).toBe('Profile')
    expect(result.current.formatLabel('settings')).toBe('Settings')
  })

  it('should handle undefined currentPiece when pathname is short', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/users/123')
    ;(useUser as jest.Mock).mockReturnValue({
      user: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserNav())

    expect(result.current.currentPiece).toBeUndefined()
  })
})
