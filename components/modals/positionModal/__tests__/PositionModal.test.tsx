import { useModalStore } from '@/store/modalStore'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { PositionModal } from '../PositionModal'

import React from 'react'
import { PositionForm } from '../PositionForm'

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
jest.mock('../PositionForm', () => ({
  PositionForm: jest.fn(() => <div data-testid="PositionForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockPositionForm = PositionForm as jest.Mock

describe('PositionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders correctly in create mode with empty initial data', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'POSITION_CREATE',
    })

    render(<PositionModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'positionCreateModal',
    )
    expect(MockPositionForm).toHaveBeenCalledWith(
      {
        initialData: { name: '' },
        positionId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode with provided modal data', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'pos-123', name: 'Software Engineer' },
      type: 'POSITION_EDIT',
    })

    render(<PositionModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'positionEditModal',
    )
    expect(MockPositionForm).toHaveBeenCalledWith(
      {
        initialData: { name: 'Software Engineer' },
        positionId: 'pos-123',
      },
      undefined,
    )
  })
})
