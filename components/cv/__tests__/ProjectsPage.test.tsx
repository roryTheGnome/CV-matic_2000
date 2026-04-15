import { render, screen } from '@testing-library/react'

import { CvProject } from '@/types/cvs'
import { formatList } from '@/utils/formatList'
import ProjectsPage from '../ProjectsPage'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../utils/formatList', () => ({
  formatList: jest.fn(),
}))

const mockProjects = [
  {
    name: 'alpha project',
    description: 'Test description for alpha.',
    start_date: 'Jan 2022',
    end_date: 'Dec 2022',
    responsibilities: ['Development', 'Testing'],
    environment: ['React', 'Jest'],
  } as unknown as CvProject,
  {
    name: 'beta project',
    description: 'Test description for beta.',
    start_date: 'Jan 2023',
    end_date: 'Present',
    responsibilities: ['Architecture'],
    environment: ['Node.js', 'AWS'],
  } as unknown as CvProject,
]

describe('ProjectsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(formatList as jest.Mock).mockImplementation((items: string[]) =>
      items.join(', '),
    )
  })

  it('should render the main title', () => {
    render(<ProjectsPage projects={[]} userRole="Developer" />)
    expect(screen.getByText('projects')).toBeInTheDocument()
  })

  it('should handle undefined projects gracefully without crashing', () => {
    const { container } = render(
      <ProjectsPage projects={undefined} userRole="Developer" />,
    )

    expect(screen.getByText('projects')).toBeInTheDocument()
    expect(container.querySelectorAll('.grid-cols-2')).toHaveLength(0)
  })

  it('should render project names in uppercase', () => {
    render(
      <ProjectsPage projects={mockProjects} userRole="Frontend Engineer" />,
    )

    expect(screen.getByText('ALPHA PROJECT')).toBeInTheDocument()
    expect(screen.getByText('BETA PROJECT')).toBeInTheDocument()
  })

  it('should render correct project details and user role', () => {
    render(
      <ProjectsPage projects={mockProjects} userRole="Frontend Engineer" />,
    )

    expect(screen.getByText('Test description for alpha.')).toBeInTheDocument()

    const roleElements = screen.getAllByText('Frontend Engineer')
    expect(roleElements).toHaveLength(2)

    expect(screen.getByText('Jan 2022 - Dec 2022')).toBeInTheDocument()
    expect(screen.getByText('Jan 2023 - Present')).toBeInTheDocument()
  })

  it('should call formatList and display formatted responsibilities and environments', () => {
    render(<ProjectsPage projects={mockProjects} userRole="Developer" />)

    expect(formatList).toHaveBeenCalledWith(['Development', 'Testing'])
    expect(formatList).toHaveBeenCalledWith(['React', 'Jest'])
    expect(formatList).toHaveBeenCalledWith(['Architecture'])
    expect(formatList).toHaveBeenCalledWith(['Node.js', 'AWS'])

    expect(screen.getByText('Development, Testing')).toBeInTheDocument()
    expect(screen.getByText('React, Jest')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('Node.js, AWS')).toBeInTheDocument()
  })

  it('should render correct translation keys for labels', () => {
    render(<ProjectsPage projects={mockProjects} userRole="Developer" />)

    const projectRolesLabels = screen.getAllByText('projectRoles')
    expect(projectRolesLabels).toHaveLength(2)

    const periodLabels = screen.getAllByText('period')
    expect(periodLabels).toHaveLength(2)

    const responsibilitiesLabels = screen.getAllByText('responsibilities')
    expect(responsibilitiesLabels).toHaveLength(2)

    const environmentsLabels = screen.getAllByText('environments')
    expect(environmentsLabels).toHaveLength(2)
  })
})
