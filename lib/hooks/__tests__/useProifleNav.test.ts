import { useUser } from '@/lib/hooks/userHooks/useUser'
import { renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useProfileNav } from '../useProfileNav'

jest.mock('../../../config/routes.ts', () => ({
  PRIVATE_ROUTES: {
    USERS: '/users',
  },
}))

jest.mock('../../../lib/hooks/userHooks/useUser', () => ({
  useUser: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

interface MockUser {
  id: string
}

describe('useProfileNav', () => {
  const mockUser: MockUser = { id: '789' }
  const mockError = new Error('User data fetching failed')

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    ;(usePathname as jest.Mock).mockReturnValue('/users/789')
  })

  it('should return only error if user is not present', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useProfileNav())

    expect(result.current).toEqual({ error: mockError })
    expect(result.current).not.toHaveProperty('tabs')
  })

  it('should return full state when user is present', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useProfileNav())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.tabs).toBeDefined()
    expect(typeof result.current.isActive).toBe('function')
  })

  it('should generate correct tabs array', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useProfileNav())

    expect(result.current.tabs).toEqual([
      { label: 'profile', path: '/users/789' },
      { label: 'skills', path: '/users/789/skills' },
      { label: 'languages', path: '/users/789/languages' },
    ])
  })

  it('should return true from isActive for exact path match', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/users/789/skills')

    const { result } = renderHook(() => useProfileNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/users/789/skills')).toBe(true)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return true from isActive for nested sub-path matches on non-base routes', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/users/789/skills/edit')

    const { result } = renderHook(() => useProfileNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/users/789/skills')).toBe(true)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return false from isActive for nested sub-path matches on the base route', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/users/789/skills')

    const { result } = renderHook(() => useProfileNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/users/789')).toBe(false)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return false from isActive for non-matching paths', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/users/789/languages')

    const { result } = renderHook(() => useProfileNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/users/789/skills')).toBe(false)
    } else {
      fail('isActive is not defined')
    }
  })
})
