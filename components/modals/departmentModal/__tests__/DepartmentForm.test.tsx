import { useDepartmentActions } from '@/lib/hooks/departmentHooks/useDepartmentActions'
import { CreateDepartmentModalFormState } from '@/types/department'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { DepartmentForm } from '../DepartmentForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../lib/hooks/departmentHooks/useDepartmentActions')

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: ({
    value,
    name,
    onChange,
  }: {
    value: string
    name: string
    onChange: () => void
  }) => (
    <input
      data-testid="InputField"
      value={value}
      name={name}
      onChange={onChange}
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

const mockUseDepartmentActions = useDepartmentActions as jest.Mock

describe('DepartmentForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const defaultHookReturn = {
    formData: { name: 'Engineering' },
    formId: 'form-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDepartmentActions.mockReturnValue(defaultHookReturn)
  })

  it('renders the form fields correctly', () => {
    render(<DepartmentForm />)

    const input = screen.getByTestId('InputField')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Engineering')
    expect(input).toHaveAttribute('name', 'name')

    expect(screen.getByTestId('ModalButtons')).toBeInTheDocument()
  })

  it('calls handleSubmit on form submission', () => {
    render(<DepartmentForm />)

    const form = screen.getByTestId('InputField').closest('form')

    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('passes initialData and departmentId to useDepartmentActions', () => {
    const initialData: CreateDepartmentModalFormState = { name: 'HR' }
    const departmentId = 'dep-123'

    render(
      <DepartmentForm initialData={initialData} departmentId={departmentId} />,
    )

    expect(mockUseDepartmentActions).toHaveBeenCalledWith(
      initialData,
      departmentId,
    )
  })

  it('passes the correct props to ModalButtons based on hook return values', () => {
    mockUseDepartmentActions.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      isFormValid: false,
      isDirty: true,
    })

    render(<DepartmentForm />)

    const modalButtons = screen.getByTestId('ModalButtons')
    expect(modalButtons).toHaveAttribute('data-dirty', 'true')
    expect(modalButtons).toHaveAttribute('data-valid', 'false')
    expect(modalButtons).toHaveAttribute('data-saving', 'true')
  })
})
