import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import VerifyMailPage from '../page'

jest.mock('@apollo/client/react')
jest.mock('next/navigation')
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: ({
    value,
    onChange,
    label,
    inputId,
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label: string
    inputId: string
  }) => (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} value={value} onChange={onChange} />
    </div>
  ),
}))

const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseRouter = useRouter as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

describe('VerifyMailPage', () => {
  const mockVerifyMail = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUseMutation.mockReturnValue([
      mockVerifyMail,
      { loading: false, error: undefined },
    ])
  })

  it('renders the verification page correctly', () => {
    render(<VerifyMailPage />)

    expect(screen.getByText('Verify your email')).toBeInTheDocument()
    expect(screen.getByLabelText('Verification code')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Verify email' }),
    ).toBeInTheDocument()
  })

  it('shows error toast when trying to verify with empty OTP', async () => {
    render(<VerifyMailPage />)

    const button = screen.getByRole('button', { name: 'Verify email' })
    fireEvent.click(button)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter the code from your email',
    )
    expect(mockVerifyMail).not.toHaveBeenCalled()
  })

  it('updates otp state on input change', () => {
    render(<VerifyMailPage />)

    const input = screen.getByLabelText('Verification code') as HTMLInputElement
    fireEvent.change(input, { target: { value: '123456' } })

    expect(input.value).toBe('123456')
  })

  it('calls verifyMail mutation and redirects to login on success', async () => {
    mockVerifyMail.mockResolvedValueOnce({ data: { verifyMail: true } })
    render(<VerifyMailPage />)

    const input = screen.getByLabelText('Verification code')
    fireEvent.change(input, { target: { value: '123456' } })

    const button = screen.getByRole('button', { name: 'Verify email' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockVerifyMail).toHaveBeenCalledWith({
        variables: { mail: { otp: '123456' } },
      })
    })

    expect(mockToast.success).toHaveBeenCalledWith(
      'Email verified successfully!',
    )
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('shows error toast when mutation fails', async () => {
    mockVerifyMail.mockRejectedValueOnce(new Error('Invalid code'))
    render(<VerifyMailPage />)

    const input = screen.getByLabelText('Verification code')
    fireEvent.change(input, { target: { value: 'wrong-code' } })

    const button = screen.getByRole('button', { name: 'Verify email' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Invalid or expired code')
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('disables button and shows loading text during mutation', () => {
    mockUseMutation.mockReturnValue([
      mockVerifyMail,
      { loading: true, error: undefined },
    ])

    render(<VerifyMailPage />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Verifying...')
  })
})
