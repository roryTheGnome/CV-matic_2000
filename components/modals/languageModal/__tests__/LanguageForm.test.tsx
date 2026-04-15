import { useLanguageActions } from '@/lib/hooks/languageHooks/useLanguageActions'
import { LanguageModalFormState } from '@/types/languages'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { LanguageForm } from '../LanguageForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../lib/hooks/languageHooks/useLanguageActions')

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: ({
    value,
    name,
    onChange,
    maxLength,
  }: {
    value: string
    name: string
    onChange: () => void
    maxLength?: number
  }) => (
    <input
      data-testid={`InputField-${name}`}
      value={value || ''}
      name={name}
      onChange={onChange}
      maxLength={maxLength}
    />
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
    <div
      data-testid="ModalButtons"
      data-dirty={isDirty}
      data-valid={isFormValid}
      data-saving={saving}
    />
  ),
}))

const mockUseLanguageActions = useLanguageActions as jest.Mock

describe('LanguageForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const defaultHookReturn = {
    formData: { name: 'English', iso2: 'EN', native_name: 'English' },
    formId: 'form-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLanguageActions.mockReturnValue(defaultHookReturn)
  })

  it('renders the form fields correctly', () => {
    render(<LanguageForm />)

    const nameInput = screen.getByTestId('InputField-name')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue('English')

    const iso2Input = screen.getByTestId('InputField-iso2')
    expect(iso2Input).toBeInTheDocument()
    expect(iso2Input).toHaveValue('EN')
    expect(iso2Input).toHaveAttribute('maxLength', '2')

    const nativeNameInput = screen.getByTestId('InputField-native_name')
    expect(nativeNameInput).toBeInTheDocument()
    expect(nativeNameInput).toHaveValue('English')

    expect(screen.getByTestId('ModalButtons')).toBeInTheDocument()
  })

  it('calls handleSubmit on form submission', () => {
    render(<LanguageForm />)

    const form = screen.getByTestId('InputField-name').closest('form')

    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('passes initialData and languageId to useLanguageActions', () => {
    const initialData: LanguageModalFormState = {
      name: 'Spanish',
      iso2: 'ES',
      native_name: 'Español',
    }
    const languageId = 'lang-123'

    render(<LanguageForm initialData={initialData} languageId={languageId} />)

    expect(mockUseLanguageActions).toHaveBeenCalledWith(initialData, languageId)
  })

  it('passes the correct props to ModalButtons based on hook return values', () => {
    mockUseLanguageActions.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      isFormValid: false,
      isDirty: true,
    })

    render(<LanguageForm />)

    const modalButtons = screen.getByTestId('ModalButtons')
    expect(modalButtons).toHaveAttribute('data-dirty', 'true')
    expect(modalButtons).toHaveAttribute('data-valid', 'false')
    expect(modalButtons).toHaveAttribute('data-saving', 'true')
  })
})
