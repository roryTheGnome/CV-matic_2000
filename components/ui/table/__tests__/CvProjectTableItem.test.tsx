import { ActionsMenu } from '@/components/admin/ActionsMenu'
import { CvProject } from '@/types/cvs'
import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import React from 'react'
import { CvProjectTableItem } from '../CvProjectTableItem'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

jest.mock('../../../../components/admin/ActionsMenu', () => ({
  ActionsMenu: jest.fn(() => <div data-testid="ActionsMenu" />),
}))

const mockUseParams = useParams as jest.Mock
const MockActionsMenu = ActionsMenu as jest.Mock

describe('CvProjectTableItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({ id: 'cv-123' })
  })

  const renderWithTable = (ui: React.ReactElement) => {
    return render(
      <table>
        <tbody>{ui}</tbody>
      </table>,
    )
  }

  it('renders project details correctly', () => {
    const mockProject = {
      name: 'Alpha Project',
      domain: 'Finance',
      start_date: '2022-01-01',
      end_date: '2022-12-31',
      description: 'Project description',
      project: {
        id: 'proj-1',
        domain: 'Finance',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    expect(screen.getByText('Alpha Project')).toBeInTheDocument()
    expect(screen.getByText('Finance')).toBeInTheDocument()
    expect(screen.getByText('2022-01-01')).toBeInTheDocument()
    expect(screen.getByText('2022-12-31')).toBeInTheDocument()
    expect(screen.getByText('Project description')).toBeInTheDocument()
    expect(screen.getByTestId('ActionsMenu')).toBeInTheDocument()
  })

  it('renders domain from project fallback if cvProject domain is missing', () => {
    const mockProject = {
      name: 'Beta Project',
      domain: '',
      start_date: '2023-01-01',
      end_date: '2023-06-01',
      description: '',
      project: {
        id: 'proj-2',
        domain: 'Healthcare',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    expect(screen.getByText('Healthcare')).toBeInTheDocument()
  })

  it('renders empty string if both domains are missing', () => {
    const mockProject = {
      name: 'Beta Project',
      domain: '',
      start_date: '2023-01-01',
      end_date: '2023-06-01',
      description: '',
      project: null,
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    const tableDataCells = screen.getAllByRole('cell')
    expect(tableDataCells[1]).toHaveTextContent('')
  })

  it('renders Till now when end_date is missing', () => {
    const mockProject = {
      name: 'Gamma Project',
      domain: 'Education',
      start_date: '2023-01-01',
      end_date: '',
      description: '',
      project: {
        id: 'proj-3',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    expect(screen.getByText('Till now')).toBeInTheDocument()
  })

  it('does not render description row if description is absent', () => {
    const mockProject = {
      name: 'Delta Project',
      domain: 'Retail',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      description: null,
      project: {
        id: 'proj-4',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(1)
  })

  it('renders description row if description is present', () => {
    const mockProject = {
      name: 'Epsilon Project',
      domain: 'Retail',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      description: 'Extensive description here',
      project: {
        id: 'proj-5',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2)
    expect(screen.getByText('Extensive description here')).toBeInTheDocument()
  })

  it('passes correct props to ActionsMenu', () => {
    const mockProject = {
      name: 'Zeta Project',
      domain: 'Logistics',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      description: '',
      project: {
        id: 'proj-6',
      },
    } as unknown as CvProject

    renderWithTable(<CvProjectTableItem cvProject={mockProject} />)

    expect(MockActionsMenu).toHaveBeenCalledWith(
      {
        editType: 'CV_PROJECT_EDIT',
        deleteType: 'CV_PROJECT_DELETE',
        item: {
          id: 'cv-123',
          projectId: 'proj-6',
          name: 'Zeta Project',
        },
      },
      undefined,
    )
  })
})
