import { fireEvent, render, screen } from '@testing-library/react'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import React from 'react'
import { ActionsMenu } from '../ActionsMenu'

jest.mock('../../../lib/hooks/useActionMenu')
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('lucide-react', () => ({
  Info: () => <svg data-testid="info-icon" />,
}))

jest.mock('../ActionMenuLayout', () => ({
  ActionMenuLayout: ({
    children,
    setIsOpen,
  }: {
    children: React.ReactNode
    setIsOpen: () => void
  }) => (
    <div data-testid="mock-action-menu-layout">
      <button data-testid="toggle-layout-btn" onClick={setIsOpen}>
        Toggle
      </button>
      {children}
    </div>
  ),
}))

jest.mock('../_ui/ActionDeleteButton', () => ({
  ActionDeleteButton: ({ handleDelete }: { handleDelete: () => void }) => (
    <button data-testid="action-delete-btn" onClick={handleDelete}>
      Delete
    </button>
  ),
}))

jest.mock('../_ui/ActionEditButton', () => ({
  ActionEditButton: ({ handleEdit }: { handleEdit: () => void }) => (
    <button data-testid="action-edit-btn" onClick={handleEdit}>
      Edit
    </button>
  ),
}))

describe('ActionsMenu', () => {
  const mockSetIsOpen = jest.fn()
  const mockHandleEdit = jest.fn()
  const mockHandleDelete = jest.fn()
  const mockHandleCvDetails = jest.fn()

  const mockMenuRef = React.createRef<HTMLDivElement>()

  const dummyItem: ModalData = { id: 'test-item-123' }
  const dummyEditType: ModalType = 'USER_EDIT'
  const dummyDeleteType: ModalType = 'USER_DELETE'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
      handleCvDetails: mockHandleCvDetails,
    })
  })

  it('should not render menu options when isOpen is false', () => {
    render(
      <ActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
      />,
    )

    expect(screen.queryByTestId('action-edit-btn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-delete-btn')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'details' }),
    ).not.toBeInTheDocument()
  })

  it('should call setIsOpen when the layout toggle is triggered', () => {
    render(
      <ActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
      />,
    )

    const toggleButton = screen.getByTestId('toggle-layout-btn')
    fireEvent.click(toggleButton)

    expect(mockSetIsOpen).toHaveBeenCalledTimes(1)
    expect(mockSetIsOpen).toHaveBeenCalledWith(true)
  })

  it('should render edit and delete buttons when isOpen is true and cvId is not provided', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
      handleCvDetails: mockHandleCvDetails,
    })

    render(
      <ActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
      />,
    )

    expect(screen.getByTestId('action-edit-btn')).toBeInTheDocument()
    expect(screen.getByTestId('action-delete-btn')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'details' }),
    ).not.toBeInTheDocument()
  })

  it('should render details and delete buttons when isOpen is true and cvId is provided', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
      handleCvDetails: mockHandleCvDetails,
    })

    render(
      <ActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        cvId="cv-123"
      />,
    )

    expect(screen.getByRole('button', { name: 'details' })).toBeInTheDocument()
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()
    expect(screen.getByTestId('action-delete-btn')).toBeInTheDocument()
    expect(screen.queryByTestId('action-edit-btn')).not.toBeInTheDocument()
  })

  it('should call handleCvDetails with cvId when details button is clicked', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
      handleCvDetails: mockHandleCvDetails,
    })

    render(
      <ActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        cvId="cv-123"
      />,
    )

    const detailsButton = screen.getByRole('button', { name: 'details' })
    fireEvent.click(detailsButton)

    expect(mockHandleCvDetails).toHaveBeenCalledTimes(1)
    expect(mockHandleCvDetails).toHaveBeenCalledWith('cv-123')
  })
})
