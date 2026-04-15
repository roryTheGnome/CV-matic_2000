import { fireEvent, render, screen } from '@testing-library/react'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import React from 'react'
import { ProjectsActionsMenu } from '../ProjectsActionsMenu'

jest.mock('../../../lib/hooks/useActionMenu')

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  Info: () => <svg data-testid="info-icon" />,
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

describe('ProjectsActionsMenu', () => {
  const mockSetIsOpen = jest.fn()
  const mockHandleEdit = jest.fn()
  const mockHandleDelete = jest.fn()
  const mockMenuRef = React.createRef<HTMLDivElement>()

  const dummyItem: ModalData = { id: 'project-123' }
  const dummyEditType = 'PROJECT_EDIT' as ModalType
  const dummyDeleteType = 'PROJECT_DELETE' as ModalType

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
      <ProjectsActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        isAdmin={true}
      />,
    )

    expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-edit-btn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-delete-btn')).not.toBeInTheDocument()
  })

  it('should call setIsOpen when the layout toggle button is clicked', () => {
    render(
      <ProjectsActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        isAdmin={true}
      />,
    )

    const toggleButton = screen.getByTestId('toggle-layout-btn')
    fireEvent.click(toggleButton)

    expect(mockSetIsOpen).toHaveBeenCalledTimes(1)
    expect(mockSetIsOpen).toHaveBeenCalledWith(true)
  })

  it('should render details link, edit button, and delete button when isOpen is true and isAdmin is true', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
    })

    render(
      <ProjectsActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        isAdmin={true}
      />,
    )

    const detailsLink = screen.getByTestId('mock-link')
    expect(detailsLink).toBeInTheDocument()
    expect(detailsLink).toHaveAttribute('href', '/projects/project-123')
    expect(screen.getByText('details')).toBeInTheDocument()
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()

    expect(screen.getByTestId('action-edit-btn')).toBeInTheDocument()
    expect(screen.getByTestId('action-delete-btn')).toBeInTheDocument()
  })

  it('should render only details link when isOpen is true and isAdmin is false', () => {
    ;(useActionMenu as jest.Mock).mockReturnValue({
      menuRef: mockMenuRef,
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      handleEdit: mockHandleEdit,
      handleDelete: mockHandleDelete,
    })

    render(
      <ProjectsActionsMenu
        editType={dummyEditType}
        deleteType={dummyDeleteType}
        item={dummyItem}
        isAdmin={false}
      />,
    )

    expect(screen.getByTestId('mock-link')).toBeInTheDocument()
    expect(screen.getByText('details')).toBeInTheDocument()

    expect(screen.queryByTestId('action-edit-btn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-delete-btn')).not.toBeInTheDocument()
  })
})
