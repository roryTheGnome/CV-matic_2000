import { LanguageItem } from '@/types/languages'
import { render, screen } from '@testing-library/react'
import { LanguageTableItem } from '../LanguageTableItem'

jest.mock('../../../../components/admin/ActionsMenu', () => ({
  ActionsMenu: ({
    editType,
    deleteType,
    item,
  }: {
    editType: string
    deleteType: string
    item: { id: string; name: string }
  }) => (
    <div data-testid="actions-menu">
      <span>Edit: {editType}</span>
      <span>Delete: {deleteType}</span>
      <span>ID: {item.id}</span>
      <span>Name: {item.name}</span>
    </div>
  ),
}))

describe('LanguageTableItem', () => {
  const mockItem: LanguageItem = {
    id: 'lang-1',
    name: 'English-Display',
    native_name: 'English-Native',
    iso2: 'en',
    created_at: '',
  }

  const renderComponent = (item: LanguageItem) => {
    return render(
      <table>
        <tbody>
          <LanguageTableItem item={item} />
        </tbody>
      </table>,
    )
  }

  it('should render language name, native name and iso2 code correctly', () => {
    renderComponent(mockItem)

    expect(screen.getByText('English-Display')).toBeInTheDocument()
    expect(screen.getByText('English-Native')).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
  })

  it('should render the native name in the correct cell position', () => {
    renderComponent(mockItem)

    const cells = screen.getAllByRole('cell')
    expect(cells[1]).toHaveTextContent('English-Native')
  })

  it('should pass correct props to ActionsMenu', () => {
    renderComponent(mockItem)

    const actionsMenu = screen.getByTestId('actions-menu')
    expect(actionsMenu).toBeInTheDocument()
    expect(screen.getByText('Edit: LANGUAGE_EDIT')).toBeInTheDocument()
    expect(screen.getByText('Delete: LANGUAGE_DELETE')).toBeInTheDocument()
    expect(screen.getByText('ID: lang-1')).toBeInTheDocument()
    expect(screen.getByText('Name: English-Display')).toBeInTheDocument()
  })
})
