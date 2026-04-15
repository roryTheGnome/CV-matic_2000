import { render, screen } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ProfileSkillEditModal } from '../ProfileSkillEditModal'

jest.mock('../../../../../store/modalStore')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('../../../../../components/modals/ModalLayout', () => ({
  ModalLayout: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="modal-layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

jest.mock(
  '../../../../../components/modals/profile/editSkill/SkillEditForm',
  () => ({
    SkillEditForm: ({
      skill,
      userId,
    }: {
      skill: { name: string }
      userId?: string
    }) => (
      <div data-testid="skill-edit-form">
        <span>Skill: {skill.name}</span>
        <span>User ID: {userId ?? 'none'}</span>
      </div>
    ),
  }),
)

describe('ProfileSkillEditModal', () => {
  const mockUseModalStore = useModalStore as unknown as jest.Mock
  const mockUseTranslations = useTranslations as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('should return null if skill data is missing', () => {
    mockUseModalStore.mockReturnValue({
      data: {
        skill: undefined,
        id: 'user-1',
      },
    })

    const { container } = render(<ProfileSkillEditModal />)
    expect(container.firstChild).toBeNull()
  })

  it('should render ModalLayout and SkillEditForm when skill data is present', () => {
    const mockSkill = { name: 'React', mastery: 'Expert' }
    const mockUserId = 'user-999'

    mockUseModalStore.mockReturnValue({
      data: {
        skill: mockSkill,
        id: mockUserId,
      },
    })

    render(<ProfileSkillEditModal />)

    expect(screen.getByTestId('modal-layout')).toBeInTheDocument()
    expect(screen.getByText('editSkill')).toBeInTheDocument()
    expect(screen.getByTestId('skill-edit-form')).toBeInTheDocument()
    expect(screen.getByText(`Skill: ${mockSkill.name}`)).toBeInTheDocument()
    expect(screen.getByText(`User ID: ${mockUserId}`)).toBeInTheDocument()
  })

  it('should pass undefined userId if id is missing in store data', () => {
    const mockSkill = { name: 'Jest' }

    mockUseModalStore.mockReturnValue({
      data: {
        skill: mockSkill,
        id: undefined,
      },
    })

    render(<ProfileSkillEditModal />)

    expect(screen.getByText('User ID: none')).toBeInTheDocument()
  })
})
