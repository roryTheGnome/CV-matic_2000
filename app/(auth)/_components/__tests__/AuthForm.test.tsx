import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PUBLIC_ROUTES } from '@/config/routes'
import { useAuthForm } from '../../(with-tabs)/_hooks/useAuthForm'
import { AuthForm } from '../AuthForm'

jest.mock('../../(with-tabs)/_hooks/useAuthForm')

const mockedUseAuthForm = useAuthForm as jest.MockedFunction<typeof useAuthForm>

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Should render the form in 'Login' mode.", () => {
    mockedUseAuthForm.mockReturnValue({
      currentError: undefined,
      isLoading: false,
      pathname: PUBLIC_ROUTES.LOGIN,
      handleSubmit: jest.fn(),
    })

    render(<AuthForm />)

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })

  it("Should render the form in 'Registration' mode.", () => {
    mockedUseAuthForm.mockReturnValue({
      currentError: undefined,
      isLoading: false,
      pathname: PUBLIC_ROUTES.REGISTER,
      handleSubmit: jest.fn(),
    })

    render(<AuthForm />)

    expect(
      screen.getByRole('button', { name: 'Create Account' }),
    ).toBeInTheDocument()
  })

  it('Should display an error message if one exists.', () => {
    mockedUseAuthForm.mockReturnValue({
      currentError: {
        message: 'Invalid email or password',
        name: '',
      },
      isLoading: false,
      pathname: PUBLIC_ROUTES.LOGIN,
      handleSubmit: jest.fn(),
    })

    render(<AuthForm />)

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
  })

  it('Should call handleSubmit when the form is submitted.', async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()

    mockedUseAuthForm.mockReturnValue({
      currentError: undefined,
      isLoading: false,
      pathname: PUBLIC_ROUTES.LOGIN,
      handleSubmit: mockSubmit,
    })

    render(<AuthForm />)

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Log in' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'secure123')

    await user.click(submitButton)

    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })
})
