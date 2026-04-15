import { SkillItem, SkillMastery } from '@/types/skills'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Skills } from '../Skills'
import { useSkill } from '../_hooks/useSkill'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../_hooks/useSkill')

jest.mock('../SkillCategorySection', () => ({
  SkillCategorySection: ({
    title,
    skills,
  }: {
    title: string
    skills: SkillMastery[]
  }) => (
    <div data-testid={`category-section-${title}`}>
      <span>{title}</span>
      <span data-testid={`skills-count-${title}`}>{skills.length}</span>
    </div>
  ),
}))

jest.mock('../../../components/ui/Button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => (
    <button onClick={onClick} data-testid="action-button">
      {children}
    </button>
  ),
}))

jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
}))

const mockUseSkill = useSkill as jest.Mock

describe('Skills', () => {
  const mockSetDeleteMode = jest.fn()
  const mockSetSelected = jest.fn()
  const mockToggleSelect = jest.fn()
  const mockHandleDelete = jest.fn()
  const mockHandleAddBtn = jest.fn()

  const mockSkillsData: SkillMastery[] = [
    { name: 'React', categoryId: 'cat-1', mastery: 'Expert' } as SkillMastery,
    {
      name: 'Node.js',
      categoryId: 'cat-2',
      mastery: 'Proficient',
    } as SkillMastery,
  ]

  const mockAllSkillsData: SkillItem[] = []

  const defaultHookReturn = {
    grouped: {
      Frontend: [mockSkillsData[0]],
      Backend: [mockSkillsData[1]],
    },
    deleteMode: false,
    selected: [],
    setDeleteMode: mockSetDeleteMode,
    setSelected: mockSetSelected,
    toggleSelect: mockToggleSelect,
    handleDelete: mockHandleDelete,
    handleAddBtn: mockHandleAddBtn,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSkill.mockReturnValue(defaultHookReturn)
  })

  it('renders correctly with grouped categories', () => {
    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    expect(screen.getByTestId('category-section-Frontend')).toBeInTheDocument()
    expect(screen.getByTestId('skills-count-Frontend')).toHaveTextContent('1')

    expect(screen.getByTestId('category-section-Backend')).toBeInTheDocument()
    expect(screen.getByTestId('skills-count-Backend')).toHaveTextContent('1')
  })

  it('does not render action buttons when owner is false', () => {
    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={false}
      />,
    )

    expect(screen.queryByText('addSkills')).not.toBeInTheDocument()
    expect(screen.queryByText('removeSkills')).not.toBeInTheDocument()
    expect(screen.queryByText('cancel')).not.toBeInTheDocument()
    expect(screen.queryByText(/confirm/i)).not.toBeInTheDocument()
  })

  it('renders add and remove buttons when owner is true and deleteMode is false', () => {
    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    expect(screen.getByText('addSkills')).toBeInTheDocument()
    expect(screen.getByText('removeSkills')).toBeInTheDocument()
    expect(screen.queryByText('cancel')).not.toBeInTheDocument()
  })

  it('calls handleAddBtn when add skills button is clicked', () => {
    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    fireEvent.click(screen.getByText('addSkills'))

    expect(mockHandleAddBtn).toHaveBeenCalledTimes(1)
  })

  it('calls handleDelete when remove skills button is clicked', () => {
    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    fireEvent.click(screen.getByText('removeSkills'))

    expect(mockHandleDelete).toHaveBeenCalledTimes(1)
  })

  it('renders cancel and confirm buttons when deleteMode is true', () => {
    mockUseSkill.mockReturnValue({
      ...defaultHookReturn,
      deleteMode: true,
      selected: ['React'],
    })

    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    expect(screen.getByText('cancel')).toBeInTheDocument()
    expect(screen.getByText('confirm (1)')).toBeInTheDocument()
    expect(screen.queryByText('addSkills')).not.toBeInTheDocument()
  })

  it('resets delete mode and selection when cancel button is clicked', () => {
    mockUseSkill.mockReturnValue({
      ...defaultHookReturn,
      deleteMode: true,
      selected: ['React', 'Node.js'],
    })

    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    fireEvent.click(screen.getByText('cancel'))

    expect(mockSetDeleteMode).toHaveBeenCalledWith(false)
    expect(mockSetSelected).toHaveBeenCalledWith([])
  })

  it('calls handleDelete when confirm button is clicked in delete mode', () => {
    mockUseSkill.mockReturnValue({
      ...defaultHookReturn,
      deleteMode: true,
      selected: ['React'],
    })

    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
      />,
    )

    fireEvent.click(screen.getByText('confirm (1)'))

    expect(mockHandleDelete).toHaveBeenCalledTimes(1)
  })

  it('passes the correct arguments to useSkill hook', () => {
    const mockOnDelete = jest.fn()

    render(
      <Skills
        skills={mockSkillsData}
        allSkills={mockAllSkillsData}
        owner={true}
        userId="user-1"
        modalType="CV_SKILL_ADD"
        cvId="cv-1"
        onDelete={mockOnDelete}
      />,
    )

    expect(mockUseSkill).toHaveBeenCalledWith({
      skills: mockSkillsData,
      allSkills: mockAllSkillsData,
      userId: 'user-1',
      owner: true,
      modalType: 'CV_SKILL_ADD',
      cvId: 'cv-1',
      onDelete: mockOnDelete,
    })
  })
})
