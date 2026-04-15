import { fireEvent, render, screen } from '@testing-library/react'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import React from 'react'
import { EmployeeActionsMenu } from '../EmployeeActionsMenu'

jest.mock('../../../lib/hooks/useActionMenu')

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  UserRoundSearch: () => <svg data-testid="user-round-search-icon" />,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className} data-testid="mock-link">
        {children}
      </a>
    )
  }
})

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

describe('EmployeeActionsMenu', () => {
  const mockSetIsOpen = jest.fn()
  const mockHandleEdit = jest.fn()
  const mockHandleDelete = jest.fn()
  const mockMenuRef = React.createRef<HTMLDivElement>()

  const dummyItem: ModalData = { id: 'user-123' }
  const dummyEditType = 'USER_EDIT' as ModalType
  const dummyDeleteType = 'USER_DELETE' as ModalType

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
    })
  })

  it('should not render menu options when isOpen is false', () => {
    render(
      <EmployeeActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
      />,
    )

    expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-edit-btn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-delete-btn')).not.toBeInTheDocument()
  })

  it('should call setIsOpen when the layout toggle button is clicked', () => {
    render(
      <EmployeeActionsMenu
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

  it('should render profile link, edit button, and delete button when isOpen is true', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
    })

    render(
      <EmployeeActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
      />,
    )

    const profileLink = screen.getByTestId('mock-link')
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', '/users/user-123')
    expect(screen.getByText('profile')).toBeInTheDocument()
    expect(screen.getByTestId('user-round-search-icon')).toBeInTheDocument()

    expect(screen.getByTestId('action-edit-btn')).toBeInTheDocument()
    expect(screen.getByTestId('action-delete-btn')).toBeInTheDocument()
  })
})
