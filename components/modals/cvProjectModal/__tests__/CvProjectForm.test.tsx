import { AddCvProjectModalFormState } from '@/types/cvs'
import { fireEvent, render, screen } from '@testing-library/react'
import { CvProjectForm } from '../CvProjectForm'
import { useCvProjectModal } from '../_hooks/useCvProjectModal'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../_hooks/useCvProjectModal')

jest.mock('../../../../components/ui/DatePickerField', () => ({
  DatePickerField: () => <div data-testid="DatePickerField" />,
}))

jest.mock('../../../../components/ui/EnvironmentSelect', () => ({
  EnvironmentSelect: () => <div data-testid="EnvironmentSelect" />,
}))

jest.mock('../../../../components/ui/inputField/InputField', () => ({
  InputField: () => <div data-testid="InputField" />,
}))

jest.mock(
  '../../../../components/ui/searchableSelect/SearchableSelect',
  () => ({
    SearchableSelect: ({ disabled }: { disabled?: boolean }) => (
      <div data-testid="SearchableSelect" data-disabled={disabled} />
    ),
  }),
)

jest.mock('../../../../components/ui/tagInputField/TagInputField', () => ({
  TagInputField: () => <div data-testid="TagInputField" />,
}))

jest.mock('../../../../components/ui/TextareaField', () => ({
  TextareaField: () => <div data-testid="TextareaField" />,
}))

jest.mock('../../ModalButtons', () => ({
  ModalButtons: () => <div data-testid="ModalButtons" />,
}))

const mockUseCvProjectModal = useCvProjectModal as jest.Mock

describe('CvProjectForm', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())

  const defaultHookReturn = {
    formData: {
      projectId: '1',
      start_date: '2023-01-01',
      domain: 'Test Domain',
      end_date: '2023-12-31',
      description: 'Test Description',
      environment: [],
      responsibilities: [],
    },
    formId: 'test-form-id',
    loading: false,
    isFormValid: true,
    isDirty: false,
    type: 'CV_PROJECT_ADD',
    projectOptions: [{ label: 'Project 1', value: '1' }],
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCvProjectModal.mockReturnValue(defaultHookReturn)
  })

  it('renders all form fields correctly', () => {
    render(<CvProjectForm />)

    expect(screen.getByTestId('SearchableSelect')).toBeInTheDocument()
    expect(screen.getAllByTestId('DatePickerField')).toHaveLength(2)
    expect(screen.getByTestId('InputField')).toBeInTheDocument()
    expect(screen.getByTestId('TextareaField')).toBeInTheDocument()
    expect(screen.getByTestId('EnvironmentSelect')).toBeInTheDocument()
    expect(screen.getByTestId('TagInputField')).toBeInTheDocument()
    expect(screen.getByTestId('ModalButtons')).toBeInTheDocument()
  })

  it('calls handleSubmit on form submission', () => {
    render(<CvProjectForm />)

    const form = screen.getByTestId('SearchableSelect').closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables SearchableSelect when type is CV_PROJECT_EDIT', () => {
    mockUseCvProjectModal.mockReturnValue({
      ...defaultHookReturn,
      type: 'CV_PROJECT_EDIT',
    })

    render(<CvProjectForm />)

    const searchableSelect = screen.getByTestId('SearchableSelect')
    expect(searchableSelect).toHaveAttribute('data-disabled', 'true')
  })

  it('passes initialData and projectId to useCvProjectModal', () => {
    const initialData: AddCvProjectModalFormState = {
      projectId: '2',
      start_date: '2022-01-01',
      domain: 'Domain',
      end_date: '2022-12-31',
      description: 'Desc',
      environment: '',
      responsibilities: '',
      cvId: '1',
      name: 'Cv 1',
      roles: 'Employee',
    }
    const projectId = 'test-project-id'

    render(<CvProjectForm initialData={initialData} projectId={projectId} />)

    expect(mockUseCvProjectModal).toHaveBeenCalledWith(initialData, projectId)
  })
})
