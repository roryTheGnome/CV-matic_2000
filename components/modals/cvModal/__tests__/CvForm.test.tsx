import { fireEvent, render, screen } from '@testing-library/react'

import { useCvActions } from '@/lib/hooks/cvHooks/useCvActions'
import React from 'react'
import { CvForm } from '../CvForm'

jest.mock('../../../../store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isAdmin: false,
    currentUserId: '1',
    logout: jest.fn(),
  })),
}))

jest.mock('../../../../lib/hooks/cvHooks/useCvActions')

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: ({
    label,
    onChange,
    name,
    value,
  }: {
    label: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name: string
    value: string
  }) => (
    <div data-testid={`input-${name}`}>
      <label>{label}</label>
      <input
        name={name}
        value={value || ''}
        onChange={onChange}
        data-testid={`input-field-${name}`}
      />
    </div>
  ),
}))

jest.mock('../../../../components/ui/TextareaField', () => ({
  TextareaField: ({
    label,
    onChange,
    name,
    value,
  }: {
    label: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    name: string
    value: string
  }) => (
    <div data-testid={`textarea-${name}`}>
      <label>{label}</label>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        data-testid={`textarea-field-${name}`}
      />
    </div>
  ),
}))

jest.mock('../../ModalButtons', () => ({
  ModalButtons: ({
    isDirty,
    isFormValid,
    saving,
    isModal,
  }: {
    isDirty: boolean
    isFormValid: boolean
    saving: boolean
    isModal: boolean
  }) => (
    <div data-testid="mock-modal-buttons">
      <span data-testid="is-dirty">{isDirty.toString()}</span>
      <span data-testid="is-valid">{isFormValid.toString()}</span>
      <span data-testid="saving">{saving.toString()}</span>
      <span data-testid="is-modal">{isModal.toString()}</span>
    </div>
  ),
}))

describe('CvForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCvActions as jest.Mock).mockReturnValue({
      formData: {
        name: 'John Doe',
        education: 'MIT',
        description: 'Software Engineer',
      },
      formId: 'test-form-id',
      loading: false,
      isFormValid: true,
      isDirty: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
    })
  })

  it('should render all form fields with data from the hook', () => {
    render(<CvForm />)

    expect(screen.getByTestId('input-field-name')).toHaveValue('John Doe')
    expect(screen.getByTestId('input-field-education')).toHaveValue('MIT')
    expect(screen.getByTestId('textarea-field-description')).toHaveValue(
      'Software Engineer',
    )
  })

  it('should pass correct labels from translations to the fields', () => {
    render(<CvForm />)

    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByText('education')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should pass state correctly to ModalButtons', () => {
    render(<CvForm isModal={true} />)

    expect(screen.getByTestId('is-dirty')).toHaveTextContent('false')
    expect(screen.getByTestId('is-valid')).toHaveTextContent('true')
    expect(screen.getByTestId('saving')).toHaveTextContent('false')
    expect(screen.getByTestId('is-modal')).toHaveTextContent('true')
  })

  it('should call handleChange when typing in an InputField', () => {
    render(<CvForm />)

    const nameInput = screen.getByTestId('input-field-name')
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    expect(mockHandleChange).toHaveBeenCalledTimes(1)
  })

  it('should call handleChange when typing in the TextareaField', () => {
    render(<CvForm />)

    const descriptionTextarea = screen.getByTestId('textarea-field-description')
    fireEvent.change(descriptionTextarea, {
      target: { value: 'New description' },
    })

    expect(mockHandleChange).toHaveBeenCalledTimes(1)
  })

  it('should call handleSubmit when the form is submitted', () => {
    const { container } = render(<CvForm />)

    const form = container.querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })
})
