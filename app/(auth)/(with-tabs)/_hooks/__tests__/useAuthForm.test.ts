import { setAuthTokens } from '@/actions/auth'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/authStore'
import { useLazyQuery, useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { SubmitEvent } from 'react'
import toast from 'react-hot-toast'
import { useAuthForm } from '../useAuthForm'

jest.mock('@apollo/client/react')
jest.mock('next/navigation')
jest.mock('../../../../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}))
jest.mock('../../../../../actions/auth')
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

describe('useAuthForm', () => {
  const mockPush = jest.fn()
  const mockLoginFn = jest.fn()
  const mockSignupFn = jest.fn()
  const mockSetFromToken = jest.fn()
  const mockSetAuthTokens = setAuthTokens as jest.MockedFunction<
    typeof setAuthTokens
  >
  const mockToastSuccess = toast.success as jest.Mock
  const mockToastError = toast.error as jest.Mock

  const mockFormData = {
    get: jest.fn(),
    append: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.FormData = jest.fn().mockImplementation(() => mockFormData)
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      setFromToken: mockSetFromToken,
    })
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockLoginFn,
      { loading: false, error: undefined },
    ])
    ;(useMutation as unknown as jest.Mock).mockReturnValue([
      mockSignupFn,
      { loading: false, error: undefined },
    ])
  })

  const createMockSubmitEvent = (email: string, pass: string) => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', pass)

    return {
      preventDefault: jest.fn(),
      currentTarget: {} as HTMLFormElement,
    } as unknown as SubmitEvent<HTMLFormElement>
  }

  it('should handle successful login flow', async () => {
    ;(usePathname as jest.Mock).mockReturnValue(PUBLIC_ROUTES.LOGIN)
    mockLoginFn.mockResolvedValue({
      data: {
        login: {
          access_token: 'access-123',
          refresh_token: 'refresh-123',
        },
      },
    })

    mockFormData.get.mockImplementation((key: string) =>
      key === 'email' ? 'test@test.com' : 'password123',
    )

    const { result } = renderHook(() => useAuthForm())
    const event = createMockSubmitEvent('test@test.com', 'password123')

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(mockLoginFn).toHaveBeenCalledWith({
      variables: { auth: { email: 'test@test.com', password: 'password123' } },
    })
    expect(mockToastSuccess).toHaveBeenCalledWith('loggedSuccess')
    expect(mockSetAuthTokens).toHaveBeenCalledWith('access-123', 'refresh-123')
    expect(mockSetFromToken).toHaveBeenCalledWith('access-123')
    expect(mockPush).toHaveBeenCalledWith(PRIVATE_ROUTES.HOME)
  })

  it('should handle successful signup flow', async () => {
    ;(usePathname as jest.Mock).mockReturnValue('/signup')
    mockSignupFn.mockResolvedValue({
      data: {
        signup: {
          access_token: 'access-456',
          refresh_token: 'refresh-456',
        },
      },
    })

    mockFormData.get.mockImplementation((key: string) =>
      key === 'email' ? 'new@test.com' : 'password123',
    )

    const { result } = renderHook(() => useAuthForm())
    const event = createMockSubmitEvent('new@test.com', 'password123')

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(mockSignupFn).toHaveBeenCalledWith({
      variables: { auth: { email: 'new@test.com', password: 'password123' } },
    })
    expect(mockToastSuccess).toHaveBeenCalledWith('registerSuccess')
    expect(mockPush).toHaveBeenCalledWith(PRIVATE_ROUTES.HOME)
  })

  it('should handle submission errors and show toast', async () => {
    ;(usePathname as jest.Mock).mockReturnValue(PUBLIC_ROUTES.LOGIN)
    const mockError = new Error('Auth Failed')
    mockLoginFn.mockRejectedValue(mockError)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockFormData.get.mockImplementation((key: string) =>
      key === 'email' ? 'fail@test.com' : 'wrong',
    )

    const { result } = renderHook(() => useAuthForm())
    const event = createMockSubmitEvent('fail@test.com', 'wrong')

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(mockToastError).toHaveBeenCalledWith('genericError')
    expect(consoleSpy).toHaveBeenCalledWith('Error:', mockError)
    consoleSpy.mockRestore()
  })

  it('should return loading state correctly when login is loading', () => {
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockLoginFn,
      { loading: true, error: undefined },
    ])
    ;(usePathname as jest.Mock).mockReturnValue(PUBLIC_ROUTES.LOGIN)

    const { result } = renderHook(() => useAuthForm())
    expect(result.current.isLoading).toBe(true)
  })

  it('should return current error when signup has error', () => {
    const mockGqlError = { message: 'Signup Error' }
    ;(useMutation as unknown as jest.Mock).mockReturnValue([
      mockSignupFn,
      { loading: false, error: mockGqlError },
    ])
    ;(usePathname as jest.Mock).mockReturnValue('/signup')

    const { result } = renderHook(() => useAuthForm())
    expect(result.current.currentError).toEqual(mockGqlError)
  })
})
