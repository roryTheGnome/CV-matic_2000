import { fireEvent, render, screen } from '@testing-library/react'

import { useProjectActions } from '@/lib/hooks/projectHooks/useProjectActions'
import { CreateProjectModalFormState } from '@/types/project'
import React from 'react'
import { ProjectForm } from '../ProjectForm'

jest.mock('../../../../lib/hooks/projectHooks/useProjectActions')
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: ({
    label,
    name,
    value,
    onChange,
  }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div data-testid={`input-${name}`}>
      <label>{label}</label>
      <input
        data-testid={`field-${name}`}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}))

jest.mock('../../../../components/ui/DatePickerField', () => ({
  DatePickerField: ({
    label,
    name,
    value,
    onChange,
  }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div data-testid={`date-picker-${name}`}>
      <label>{label}</label>
      <input
        data-testid={`field-${name}`}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}))

jest.mock('../../../../components/ui/TextareaField', () => ({
  TextareaField: ({
    label,
    name,
    value,
    onChange,
  }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  }) => (
    <div data-testid={`textarea-${name}`}>
      <label>{label}</label>
      <textarea
        data-testid={`field-${name}`}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}))

jest.mock('../../../../components/ui/EnvironmentSelect', () => ({
  EnvironmentSelect: ({ value }: { value: string[] }) => (
    <div data-testid="environment-select">{value.join(', ')}</div>
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
      <span>Dirty: {isDirty.toString()}</span>
      <span>Valid: {isFormValid.toString()}</span>
      <span>Saving: {saving.toString()}</span>
    </div>
  ),
}))

describe('ProjectForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const mockHookData = {
    formData: {
      name: 'Test Project',
      start_date: '2023-01-01',
      domain: 'Testing',
      end_date: '2023-12-31',
      description: 'Project Description',
      environment: ['React', 'Jest'],
    } as unknown as CreateProjectModalFormState,
    formId: 'test-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useProjectActions as jest.Mock).mockReturnValue(mockHookData)
  })

  it('should render all form fields with values from the hook', () => {
    render(<ProjectForm />)

    expect(screen.getByTestId('field-name')).toHaveValue('Test Project')
    expect(screen.getByTestId('field-start_date')).toHaveValue('2023-01-01')
    expect(screen.getByTestId('field-domain')).toHaveValue('Testing')
    expect(screen.getByTestId('field-end_date')).toHaveValue('2023-12-31')
    expect(screen.getByTestId('field-description')).toHaveValue(
      'Project Description',
    )
    expect(screen.getByTestId('environment-select')).toHaveTextContent(
      'React, Jest',
    )
  })

  it('should render correct field labels based on translations', () => {
    render(<ProjectForm />)

    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByText('startDate')).toBeInTheDocument()
    expect(screen.getByText('domain')).toBeInTheDocument()
    expect(screen.getByText('endDate')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should trigger handleChange when field values change', () => {
    render(<ProjectForm />)

    const nameInput = screen.getByTestId('field-name')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })

    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('should trigger handleSubmit when the form is submitted', () => {
    render(<ProjectForm />)

    const form = screen.getByTestId('field-name').closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it('should pass form state props correctly to ModalButtons', () => {
    ;(useProjectActions as jest.Mock).mockReturnValue({
      ...mockHookData,
      isDirty: true,
      isFormValid: false,
      loading: true,
    })

    render(<ProjectForm />)

    const buttons = screen.getByTestId('modal-buttons')
    expect(buttons).toHaveTextContent('Dirty: true')
    expect(buttons).toHaveTextContent('Valid: false')
    expect(buttons).toHaveTextContent('Saving: true')
  })
})
