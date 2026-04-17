import { useEditableProfile } from '@/lib/hooks/userHooks/useEditableProfile'
import { User } from '@/types/user'
import { fireEvent, render, screen } from '@testing-library/react'
import { StaticImageData } from 'next/image'
import React from 'react'
import EditableProfile from '../EditableProfile'

jest.mock('../../../lib/hooks/userHooks/useEditableProfile')

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string | StaticImageData; alt: string }) => (
    <img
      src={typeof src === 'string' ? src : 'default-profile.png'}
      alt={alt}
      data-testid="next-image"
    />
  ),
}))

jest.mock('../../ui/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode
    onClick: () => void
    disabled: boolean
  }) => (
    <button onClick={onClick} disabled={disabled} data-testid="Button">
      {children}
    </button>
  ),
}))

jest.mock('../../ui/inputField/InputField', () => ({
  InputField: ({
    value,
    onChange,
    name,
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name: string
  }) => (
    <input data-testid={`input-${name}`} value={value} onChange={onChange} />
  ),
}))

jest.mock('../../ui/select/Select', () => ({
  Select: ({
    children,
    handleChange,
    id,
    disabled,
    value,
  }: {
    children: React.ReactNode
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    id: string
    disabled: boolean
    value: string
  }) => (
    <select
      data-testid={`select-${id}`}
      onChange={handleChange}
      disabled={disabled}
      value={value}
    >
      {children}
    </select>
  ),
}))

jest.mock('../../ui/select/Option', () => ({
  Option: ({ title, value }: { title: string; value: string }) => (
    <option value={value}>{title}</option>
  ),
}))

const mockUseEditableProfile = useEditableProfile as jest.Mock

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  department_name: 'IT',
  position_name: 'Developer',
  profile: {
    first_name: 'John',
    last_name: 'Doe',
    created_at: '1672531200000',
    avatar: null,
  },
} as User

describe('EditableProfile', () => {
  const mockSetFirstName = jest.fn()
  const mockSetLastName = jest.fn()
  const mockSetDepartmentId = jest.fn()
  const mockSetPositionId = jest.fn()
  const mockHandleAvatarChange = jest.fn()
  const mockHandleDeleteAvatar = jest.fn()
  const mockHandleSave = jest.fn()

  const defaultHookReturn = {
    firstName: 'John',
    lastName: 'Doe',
    departmentId: 'dep-1',
    positionId: 'pos-1',
    depData: { departments: [{ id: 'dep-1', name: 'IT' }] },
    depLoading: false,
    posData: { positions: [{ id: 'pos-1', name: 'Developer' }] },
    posLoading: false,
    loading: false,
    preview: null,
    hasUnsavedChanges: false,
    handleAvatarChange: mockHandleAvatarChange,
    handleDeleteAvatar: mockHandleDeleteAvatar,
    handleSave: mockHandleSave,
    setFirstName: mockSetFirstName,
    setLastName: mockSetLastName,
    setDepartmentId: mockSetDepartmentId,
    setPositionId: mockSetPositionId,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseEditableProfile.mockReturnValue(defaultHookReturn)
  })

  it('renders correctly with user details', () => {
    render(<EditableProfile user={mockUser} />)

    expect(screen.getByTestId('next-image')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()

    const inputFirstName = screen.getByTestId(
      'input-first_name',
    ) as HTMLInputElement
    expect(inputFirstName.value).toBe('John')

    const inputLastName = screen.getByTestId(
      'input-last_name',
    ) as HTMLInputElement
    expect(inputLastName.value).toBe('Doe')

    expect(screen.getByTestId('select-department')).toBeInTheDocument()
    expect(screen.getByTestId('select-positionId')).toBeInTheDocument()
  })

  it('calls setDepartmentId on department select change', () => {
    mockUseEditableProfile.mockReturnValue({
      ...defaultHookReturn,
      depData: {
        departments: [
          { id: 'dep-1', name: 'IT' },
          { id: 'dep-2', name: 'HR' },
        ],
      },
    })

    render(<EditableProfile user={mockUser} />)

    const select = screen.getByTestId('select-department')
    fireEvent.change(select, { target: { value: 'dep-2' } })

    expect(mockSetDepartmentId).toHaveBeenCalledWith('dep-2')
  })

  it('calls setPositionId on position select change', () => {
    mockUseEditableProfile.mockReturnValue({
      ...defaultHookReturn,
      posData: {
        positions: [
          { id: 'pos-1', name: 'Developer' },
          { id: 'pos-2', name: 'Manager' },
        ],
      },
    })

    render(<EditableProfile user={mockUser} />)

    const select = screen.getByTestId('select-positionId')
    fireEvent.change(select, { target: { value: 'pos-2' } })

    expect(mockSetPositionId).toHaveBeenCalledWith('pos-2')
  })

  it('calls handleAvatarChange when a file is selected', () => {
    render(<EditableProfile user={mockUser} />)

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    })
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(mockHandleAvatarChange).toHaveBeenCalled()
  })

  it('enables save button and calls handleSave when there are unsaved changes', () => {
    mockUseEditableProfile.mockReturnValue({
      ...defaultHookReturn,
      hasUnsavedChanges: true,
    })

    render(<EditableProfile user={mockUser} />)
    const saveButton = screen.getByTestId('Button')
    expect(saveButton).not.toBeDisabled()
    fireEvent.click(saveButton)
    expect(mockHandleSave).toHaveBeenCalled()
  })
})
