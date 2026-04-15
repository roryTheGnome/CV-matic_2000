import { ProjectsActionsMenu } from '@/components/admin/ProjectsActionsMenu'
import { Project } from '@/types/project'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ProjectTableItem } from '../ProjectTableItem'

jest.mock('../../../../components/admin/ProjectsActionsMenu', () => ({
  ProjectsActionsMenu: jest.fn(() => <div data-testid="ProjectsActionsMenu" />),
}))

const MockProjectsActionsMenu = ProjectsActionsMenu as jest.Mock

describe('ProjectTableItem', () => {
  const mockProject: Project = {
    id: 'proj-1',
    name: 'Test Project',
    domain: 'E-commerce',
    start_date: '2020-01-01',
    end_date: '2021-01-01',
    description: 'A detailed description',
    environment: ['React', 'TypeScript', 'Node.js'],
  }

  const renderInTable = (ui: React.ReactElement) => {
    return render(
      <table>
        <tbody>{ui}</tbody>
      </table>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders core project information correctly', () => {
    renderInTable(<ProjectTableItem project={mockProject} isAdmin={false} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('E-commerce')).toBeInTheDocument()
    expect(screen.getByText('2020-01-01')).toBeInTheDocument()
    expect(screen.getByText('2021-01-01')).toBeInTheDocument()
  })

  it('renders "Till now" if end_date is missing', () => {
    const ongoingProject = { ...mockProject, end_date: '' }
    renderInTable(<ProjectTableItem project={ongoingProject} isAdmin={false} />)

    expect(screen.getByText('Till now')).toBeInTheDocument()
  })

  it('renders description row when description is provided', () => {
    renderInTable(<ProjectTableItem project={mockProject} isAdmin={false} />)

    expect(screen.getByText('A detailed description')).toBeInTheDocument()
  })

  it('does not render description row when description is empty', () => {
    const noDescProject = { ...mockProject, description: '' }
    renderInTable(<ProjectTableItem project={noDescProject} isAdmin={false} />)

    expect(screen.queryByText('A detailed description')).not.toBeInTheDocument()
  })

  it('renders environment tags when environment array is not empty', () => {
    renderInTable(<ProjectTableItem project={mockProject} isAdmin={false} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('does not render environment row when environment array is empty', () => {
    const noEnvProject = { ...mockProject, environment: [] }
    renderInTable(<ProjectTableItem project={noEnvProject} isAdmin={false} />)

    const tableCells = screen.queryAllByRole('cell')
    expect(
      tableCells.some((cell) => cell.className.includes('flex-wrap')),
    ).toBe(false)
  })

  it('passes correct props to ProjectsActionsMenu', () => {
    renderInTable(<ProjectTableItem project={mockProject} isAdmin={true} />)

    expect(MockProjectsActionsMenu).toHaveBeenCalledWith(
      {
        editType: 'PROJECT_EDIT',
        deleteType: 'PROJECT_DELETE',
        item: { id: 'proj-1', name: 'Test Project' },
        isAdmin: true,
      },
      undefined,
    )
  })
})
