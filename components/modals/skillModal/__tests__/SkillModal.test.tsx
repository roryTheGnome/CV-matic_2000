import { client } from '@/lib/apollo-client'
import { useModalStore } from '@/store/modalStore'
import { SkillItem } from '@/types/skills'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { SkillForm } from '../SkillForm'
import { SkillModal } from '../SkillModal'

jest.mock('../../../../store/modalStore')
jest.mock('../../../../api/graphql/queries/skills', () => ({
  SKILL_FRAGMENT: 'SKILL_FRAGMENT',
}))
jest.mock('../../../../lib/apollo-client', () => ({
  client: {
    readFragment: jest.fn(),
  },
}))
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('../../ModalLayout', () => ({
  ModalLayout: ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <div data-testid="ModalLayout" data-title={title}>
      {children}
    </div>
  ),
}))
jest.mock('../SkillForm', () => ({
  SkillForm: jest.fn(() => <div data-testid="SkillForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockReadFragment = client.readFragment as jest.Mock
const MockSkillForm = SkillForm as jest.Mock

describe('SkillModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders correctly in create mode without fetching from cache', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'SKILL_CREATE',
    })

    render(<SkillModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'createSkill',
    )
    expect(mockReadFragment).not.toHaveBeenCalled()

    expect(MockSkillForm).toHaveBeenCalledWith(
      {
        initialData: { name: '', categoryId: '' },
        skillId: undefined,
      },
      undefined, // Changed from undefined
    )
  })

  it('renders correctly in edit mode and fetches data from apollo cache', () => {
    const cachedSkill: SkillItem = {
      id: 'skill-123',
      name: 'React',
      category: {
        id: 'cat-1',
      },
      category_name: '',
      category_parent_name: '',
    }

    mockUseModalStore.mockReturnValue({
      data: { id: 'skill-123' },
      type: 'SKILL_EDIT',
    })
    mockReadFragment.mockReturnValue(cachedSkill)

    render(<SkillModal />)

    expect(mockReadFragment).toHaveBeenCalledWith({
      id: 'Skill:skill-123',
      fragment: 'SKILL_FRAGMENT',
    })

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'editSkill',
    )

    expect(MockSkillForm).toHaveBeenCalledWith(
      {
        initialData: {
          name: 'React',
          categoryId: 'cat-1',
        },
        skillId: 'skill-123',
      },
      undefined, // Changed from undefined
    )
  })

  it('renders correctly in edit mode when cached data is not found', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'skill-456' },
      type: 'SKILL_EDIT',
    })
    mockReadFragment.mockReturnValue(null)

    render(<SkillModal />)

    expect(mockReadFragment).toHaveBeenCalledWith({
      id: 'Skill:skill-456',
      fragment: 'SKILL_FRAGMENT',
    })

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'editSkill',
    )

    expect(MockSkillForm).toHaveBeenCalledWith(
      {
        initialData: { name: '', categoryId: '' },
        skillId: 'skill-456',
      },
      undefined,
    )
  })
})
