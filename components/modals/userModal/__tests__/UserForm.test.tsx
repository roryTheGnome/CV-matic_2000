import { useUserActions } from '@/lib/hooks/userHooks/useUserActions'
import { CreateUserModalFormState } from '@/types/user'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { UserForm } from '../UserForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../lib/hooks/userHooks/useUserActions')

jest.mock('../CreateUserLeftSide', () => ({
  CreateUserLeftSide: ({
    formData,
    handleChange,
  }: {
    formData: CreateUserModalFormState
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div data-testid="left-side">
      <input
        data-testid="left-input"
        value={formData.email}
        onChange={handleChange}
        name="email"
      />
    </div>
  ),
}))

jest.mock('../CreateUserRightSide', () => ({
  CreateUserRightSide: ({
    formData,
  }: {
    formData: CreateUserModalFormState
  }) => (
    <div data-testid="right-side">
      <span data-testid="right-first-name">{formData.firstName}</span>
    </div>
  ),
}))

jest.mock('../../ModalButtons', () => ({
  ModalButtons: ({
    isDirty,
    isFormValid,
    saving,
  }: {
    isDirty: boolean
    isFormValid: boolean
    saving: boolean
  }) => (
    <div data-testid="modal-buttons">
      <span data-testid="status-dirty">{isDirty.toString()}</span>
      <span data-testid="status-valid">{isFormValid.toString()}</span>
      <span data-testid="status-saving">{saving.toString()}</span>
    </div>
  ),
}))

describe('UserForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const mockHookReturn = {
    formData: {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    } as unknown as CreateUserModalFormState,
    formId: 'user-form-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserActions as jest.Mock).mockReturnValue(mockHookReturn)
  })

  it('should render both left and right side components with hook data', () => {
    render(<UserForm />)

    expect(screen.getByTestId('left-side')).toBeInTheDocument()
    expect(screen.getByTestId('right-side')).toBeInTheDocument()
    expect(screen.getByTestId('left-input')).toHaveValue('test@example.com')

    expect(screen.getByTestId('right-first-name')).toHaveTextContent('John')
  })

  it('should call handleChange when child components trigger it', () => {
    render(<UserForm />)

    const input = screen.getByTestId('left-input')
    fireEvent.change(input, { target: { value: 'new@example.com' } })

    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('should call handleSubmit when the form is submitted', () => {
    render(<UserForm />)

    const form = screen.getByTestId('left-input').closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should propagate form state correctly to ModalButtons', () => {
    ;(useUserActions as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      isDirty: true,
      isFormValid: false,
      loading: true,
    })

    render(<UserForm />)

    expect(screen.getByTestId('status-dirty')).toHaveTextContent('true')
    expect(screen.getByTestId('status-valid')).toHaveTextContent('false')
    expect(screen.getByTestId('status-saving')).toHaveTextContent('true')
  })

  it('should pass initialData and userId to the useUserActions hook', () => {
    const initialData = { email: 'init@test.com' } as CreateUserModalFormState
    const userId = 'user-123'

    render(<UserForm initialData={initialData} userId={userId} />)

    expect(useUserActions).toHaveBeenCalledWith(initialData, userId)
  })
})
