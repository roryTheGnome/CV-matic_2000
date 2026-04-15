import { render, screen } from '@testing-library/react'

import { CvProject } from '@/types/cvs'
import { SkillMastery } from '@/types/skills'
import { getExperienceYears } from '@/utils/getFirstUsed'
import { getLastUsed } from '@/utils/getLastUsed'
import ProfecionalSkillsPage from '../ProfecionalSkillsPage'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../utils/getFirstUsed', () => ({
  getExperienceYears: jest.fn(),
}))

jest.mock('../../../utils/getLastUsed', () => ({
  getLastUsed: jest.fn(),
}))

const mockProjects = [
  { id: 'project-1', name: 'Alpha' } as unknown as CvProject,
]

const mockGrouped: Record<string, SkillMastery[]> = {
  Frontend: [
    { name: 'React' } as unknown as SkillMastery,
    { name: 'Vue' } as unknown as SkillMastery,
  ],
  Backend: [{ name: 'Node.js' } as unknown as SkillMastery],
}

describe('ProfecionalSkillsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the main title and table headers', () => {
    render(<ProfecionalSkillsPage grouped={{}} projects={[]} />)

    expect(screen.getByText('professionalSkills')).toBeInTheDocument()
    expect(screen.getByText('skills')).toBeInTheDocument()
    expect(screen.getByText('experienceInYears')).toBeInTheDocument()
    expect(screen.getByText('lastUsed')).toBeInTheDocument()
  })

  it('should render all categories and skills correctly', () => {
    ;(getExperienceYears as jest.Mock).mockReturnValue(2)
    ;(getLastUsed as jest.Mock).mockReturnValue('2023')

    render(
      <ProfecionalSkillsPage grouped={mockGrouped} projects={mockProjects} />,
    )

    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()

    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('should call utility functions and display their returned values', () => {
    ;(getExperienceYears as jest.Mock).mockImplementation(
      (skillName: string) => {
        if (skillName === 'React') return 5
        return null
      },
    )
    ;(getLastUsed as jest.Mock).mockImplementation((skillName: string) => {
      if (skillName === 'React') return '2024'
      return null
    })

    render(
      <ProfecionalSkillsPage grouped={mockGrouped} projects={mockProjects} />,
    )

    expect(getExperienceYears).toHaveBeenCalledWith('React', mockProjects)
    expect(getLastUsed).toHaveBeenCalledWith('React', mockProjects)

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('should apply the top border class only to the first category', () => {
    const { container } = render(
      <ProfecionalSkillsPage grouped={mockGrouped} projects={mockProjects} />,
    )

    const gridContainers = container.querySelectorAll('.grid-cols-4.gap-y-3')

    const firstCategoryWrapper = gridContainers[0]?.parentElement
    expect(firstCategoryWrapper).toHaveClass('border-t-2', 'border-red-500')

    const secondCategoryWrapper = gridContainers[1]?.parentElement
    expect(secondCategoryWrapper).not.toHaveClass(
      'border-t-2',
      'border-red-500',
    )
  })
})
