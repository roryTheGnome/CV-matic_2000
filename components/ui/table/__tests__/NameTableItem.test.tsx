import { ActionsMenu } from '@/components/admin/ActionsMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { NameTableItem } from '../NameTableItem'

jest.mock('../../../../components/admin/ActionsMenu', () => ({
  ActionsMenu: jest.fn(() => <div data-testid="ActionsMenu" />),
}))

const MockActionsMenu = ActionsMenu as jest.Mock

describe('NameTableItem', () => {
  const mockItem: ModalData = {
    id: '123',
    name: 'Test Item',
  }

  const editType: ModalType = 'SKILL_EDIT'
  const deleteType: ModalType = 'SKILL_DELETE'

  const renderWithTable = (ui: React.ReactElement) => {
    return render(
      <table>
        <tbody>{ui}</tbody>
      </table>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the item name correctly', () => {
    renderWithTable(
      <NameTableItem
        item={mockItem}
        editType={editType}
        deleteType={deleteType}
        isAdmin={false}
      />,
    )

    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('renders ActionsMenu when isAdmin is true', () => {
    renderWithTable(
      <NameTableItem
        item={mockItem}
        editType={editType}
        deleteType={deleteType}
        isAdmin={true}
      />,
    )

    expect(screen.getByTestId('ActionsMenu')).toBeInTheDocument()
    expect(MockActionsMenu).toHaveBeenCalledWith(
      {
        editType,
        deleteType,
        item: { id: mockItem.id, name: mockItem.name },
      },
      undefined,
    )
  })

  it('does not render ActionsMenu when isAdmin is false', () => {
    renderWithTable(
      <NameTableItem
        item={mockItem}
        editType={editType}
        deleteType={deleteType}
        isAdmin={false}
      />,
    )

    expect(screen.queryByTestId('ActionsMenu')).not.toBeInTheDocument()
  })

  it('has the correct CSS classes for the table row', () => {
    renderWithTable(
      <NameTableItem
        item={mockItem}
        editType={editType}
        deleteType={deleteType}
        isAdmin={false}
      />,
    )

    const row = screen.getByRole('row')
    expect(row).toHaveClass('divide-y', 'divide-gray-500')
  })
})
