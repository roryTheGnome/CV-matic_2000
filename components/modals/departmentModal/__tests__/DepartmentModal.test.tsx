import { useModalStore } from '@/store/modalStore'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { DepartmentModal } from '../DepartmentModal'

import React from 'react'
import { DepartmentForm } from '../DepartmentForm'

jest.mock('../../../../store/modalStore')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('../../ModalLayout', () => ({
  ModalLayout: ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <div data-testid="ModalLayout" data-title={title}>
      {children}
    </div>
  ),
}))
jest.mock('../DepartmentForm', () => ({
  DepartmentForm: jest.fn(() => <div data-testid="DepartmentForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockDepartmentForm = DepartmentForm as jest.Mock

describe('DepartmentModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders correctly in create mode with default empty values', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'DEPARTMENT_CREATE',
    })

    render(<DepartmentModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'departmentCreateModal',
    )
    expect(MockDepartmentForm).toHaveBeenCalledWith(
      {
        initialData: { name: '' },
        departmentId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode with provided modal data', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'dept-123', name: 'Engineering' },
      type: 'DEPARTMENT_EDIT',
    })

    render(<DepartmentModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'departmentEditModal',
    )
    expect(MockDepartmentForm).toHaveBeenCalledWith(
      {
        initialData: { name: 'Engineering' },
        departmentId: 'dept-123',
      },
      undefined,
    )
  })
})
