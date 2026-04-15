import { SkillItem } from '@/types/skills'
import { render, screen, within } from '@testing-library/react'
import { SkillTableItem } from '../SkillTableItem'

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
      <span>{editType}</span>
      <span>{deleteType}</span>
      <span>{item.id}</span>
      <span>{item.name}</span>
    </div>
  ),
}))

describe('SkillTableItem', () => {
  const mockItem: SkillItem = {
    id: 'skill-id-123',
    name: 'TypeScript',
    category_parent_name: 'Programming Languages',
    category_name: 'Web Development',
    category: {
      id: '1',
    },
  }

  const renderComponent = (item: SkillItem) => {
    return render(
      <table>
        <tbody>
          <SkillTableItem item={item} />
        </tbody>
      </table>,
    )
  }

  it('should render the skill name correctly', () => {
    renderComponent(mockItem)
    const skillNameCells = screen.getAllByText('TypeScript')
    expect(skillNameCells.length).toBeGreaterThanOrEqual(1)
    expect(skillNameCells[0]).toBeInTheDocument()
  })

  it('should render the parent category and sub-category correctly', () => {
    renderComponent(mockItem)
    expect(screen.getByText('Programming Languages')).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
  })

  it('should pass correct props to the ActionsMenu component', () => {
    renderComponent(mockItem)

    const actionsMenu = screen.getByTestId('actions-menu')
    expect(actionsMenu).toBeInTheDocument()

    const menuScope = within(actionsMenu)
    expect(menuScope.getByText('SKILL_EDIT')).toBeInTheDocument()
    expect(menuScope.getByText('SKILL_DELETE')).toBeInTheDocument()
    expect(menuScope.getByText('skill-id-123')).toBeInTheDocument()
    expect(menuScope.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should contain a table row with the correct classes', () => {
    const { container } = renderComponent(mockItem)
    const row = container.querySelector('tr')
    expect(row).toHaveClass('divide-y', 'divide-gray-500')
  })
})
