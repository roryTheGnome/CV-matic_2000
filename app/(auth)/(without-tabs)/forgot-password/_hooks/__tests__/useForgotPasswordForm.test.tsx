import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useTranslations } from 'next-intl'
import { SubmitEvent } from 'react'
import toast from 'react-hot-toast'
import { useForgotPasswordForm } from '../useForgotPasswordForm'

jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
}))

describe('useForgotPasswordForm', () => {
  const mockForgotPassword = jest.fn()
  const mockT = jest.fn((key: string) => key)

  const mockedUseMutation = mocked(useMutation)
  const mockedUseTranslations = mocked(useTranslations)
  const mockedToast = mocked(toast)

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseTranslations.mockReturnValue(
      mockT as unknown as ReturnType<typeof useTranslations>,
    )
    mockedUseMutation.mockReturnValue([
      mockForgotPassword,
      { loading: false, error: null } as never,
    ])
  })

  const createMockSubmitEvent = (email: string) => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    input.name = 'email'
    input.value = email
    form.appendChild(input)

    return {
      preventDefault: jest.fn(),
      currentTarget: form,
    } as unknown as SubmitEvent<HTMLFormElement>
  }

  it('should return default loading and error states', () => {
    const { result } = renderHook(() => useForgotPasswordForm())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should call forgotPassword with correct variables on submit', async () => {
    const mockPromise = Promise.resolve()
    mockForgotPassword.mockReturnValue(mockPromise)

    const { result } = renderHook(() => useForgotPasswordForm())
    const email = 'user@example.com'
    const event = createMockSubmitEvent(email)

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockForgotPassword).toHaveBeenCalledWith({
      variables: {
        auth: { email },
      },
    })
  })

  it('should trigger toast.promise with correct translation keys', async () => {
    const mockPromise = Promise.resolve()
    mockForgotPassword.mockReturnValue(mockPromise)

    const { result } = renderHook(() => useForgotPasswordForm())
    const event = createMockSubmitEvent('test@test.com')

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(mockedToast.promise).toHaveBeenCalledWith(
      mockPromise,
      {
        loading: 'sending',
        success: 'checkInbox',
        error: 'errorOccurred',
      },
      { id: 'forgot-password' },
    )
  })

  it('should use mutation error message in toast if provided', async () => {
    const errorMessage = 'User not found'
    mockedUseMutation.mockReturnValue([
      mockForgotPassword,
      { loading: false, error: { message: errorMessage } } as never,
    ])

    const { result } = renderHook(() => useForgotPasswordForm())
    const event = createMockSubmitEvent('fail@test.com')

    await act(async () => {
      await result.current.handleSubmit(event)
    })

    expect(mockedToast.promise).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        error: errorMessage,
      }),
      expect.anything(),
    )
  })

  it('should reflect loading state from the mutation hook', () => {
    mockedUseMutation.mockReturnValue([
      mockForgotPassword,
      { loading: true, error: null } as never,
    ])

    const { result } = renderHook(() => useForgotPasswordForm())
    expect(result.current.loading).toBe(true)
  })
})
