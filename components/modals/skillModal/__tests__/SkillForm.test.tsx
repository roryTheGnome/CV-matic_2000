import { fireEvent, render, screen } from '@testing-library/react'

import { useSkillActions } from '@/lib/hooks/skillHooks/useSkillActions'
import { SkillModalFormState } from '@/types/skills'
import React from 'react'
import { SkillForm } from '../SkillForm'

jest.mock('../../../../lib/hooks/skillHooks/useSkillActions')
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
    <div data-testid="input-field-wrapper">
      <label>{label}</label>
      <input
        data-testid={`input-${name}`}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}))

jest.mock('../../SkillCategorySelect', () => ({
  SkillSelect: ({
    formData,
    handleChange,
  }: {
    formData: SkillModalFormState
    handleChange: (e: { target: { name: string; value: string } }) => void
  }) => (
    <div data-testid="skill-select-wrapper">
      <button
        data-testid="mock-category-change"
        onClick={() =>
          handleChange({ target: { name: 'category', value: 'Technical' } })
        }
      >
        Change Category
      </button>
      <span>{formData.name}</span>
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

describe('SkillForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const mockHookReturn = {
    formData: {
      name: 'React',
    } as SkillModalFormState,
    formId: 'skill-form-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSkillActions as jest.Mock).mockReturnValue(mockHookReturn)
  })

  it('should render the form with initial data from the hook', () => {
    render(<SkillForm />)

    expect(screen.getByTestId('input-name')).toHaveValue('React')
    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByTestId('skill-select-wrapper')).toBeInTheDocument()
  })

  it('should call handleChange when the input field value changes', () => {
    render(<SkillForm />)

    const input = screen.getByTestId('input-name')
    fireEvent.change(input, { target: { value: 'TypeScript' } })

    expect(mockHandleChange).toHaveBeenCalledTimes(1)
  })

  it('should call handleChange when the SkillSelect triggers a change', () => {
    render(<SkillForm />)

    const categoryBtn = screen.getByTestId('mock-category-change')
    fireEvent.click(categoryBtn)

    expect(mockHandleChange).toHaveBeenCalledWith({
      target: { name: 'category', value: 'Technical' },
    })
  })

  it('should call handleSubmit when the form is submitted', () => {
    render(<SkillForm />)

    const form = screen.getByTestId('input-name').closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should pass correct state props to ModalButtons', () => {
    ;(useSkillActions as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      isDirty: true,
      isFormValid: false,
      loading: true,
    })

    render(<SkillForm />)

    expect(screen.getByTestId('status-dirty')).toHaveTextContent('true')
    expect(screen.getByTestId('status-valid')).toHaveTextContent('false')
    expect(screen.getByTestId('status-saving')).toHaveTextContent('true')
  })
})
