import { render, screen } from '@testing-library/react'

import { Cvs } from '@/types/cvs'
import { SkillMastery } from '@/types/skills'
import MainPage from '../MainPage'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockCv = {
  name: 'Frontend Developer CV',
  description: 'Passionate developer with 5 years of experience',
  education: 'BSc Computer Science',
  user: {
    position_name: 'Senior Frontend Developer',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
    },
  },
  languages: [{ name: 'English' }, { name: 'Spanish' }],
  projects: [
    { name: 'Project Alpha', domain: 'E-commerce' },
    { name: 'Project Beta', domain: 'Healthcare' },
  ],
} as unknown as Cvs

const mockGrouped: Record<string, SkillMastery[]> = {
  Frontend: [
    { name: 'React' } as unknown as SkillMastery,
    { name: 'TypeScript' } as unknown as SkillMastery,
  ],
  Backend: [{ name: 'Node.js' } as unknown as SkillMastery],
}

describe('MainPage', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should render user profile information', () => {
    render(<MainPage cv={mockCv} grouped={mockGrouped} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument()
  })

  it('should render basic CV information including name, description, and education', () => {
    render(<MainPage cv={mockCv} grouped={mockGrouped} />)

    expect(screen.getByText('Frontend Developer CV')).toBeInTheDocument()
    expect(
      screen.getByText('Passionate developer with 5 years of experience'),
    ).toBeInTheDocument()
    expect(screen.getByText('education')).toBeInTheDocument()
    expect(screen.getByText('BSc Computer Science')).toBeInTheDocument()
  })

  it('should render languages and domains formatted as comma-separated strings ending with a dot', () => {
    render(<MainPage cv={mockCv} grouped={mockGrouped} />)

    expect(screen.getByText('languageProficiency')).toBeInTheDocument()
    expect(screen.getByText('English, Spanish.')).toBeInTheDocument()

    expect(screen.getByText('domains')).toBeInTheDocument()
    expect(screen.getByText('E-commerce, Healthcare.')).toBeInTheDocument()
  })

  it('should render grouped skills formatted correctly', () => {
    render(<MainPage cv={mockCv} grouped={mockGrouped} />)

    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('React, TypeScript.')).toBeInTheDocument()

    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('Node.js.')).toBeInTheDocument()
  })

  it('should log project names to the console', () => {
    render(<MainPage cv={mockCv} grouped={mockGrouped} />)

    expect(consoleSpy).toHaveBeenCalledWith('Project Alpha')
    expect(consoleSpy).toHaveBeenCalledWith('Project Beta')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })
})
