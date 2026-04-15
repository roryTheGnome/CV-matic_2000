import { fireEvent, render, screen } from '@testing-library/react'

import { SkillMastery } from '@/types/skills'
import React from 'react'
import { CvSkillForm } from '../CvSkillForm'
import { useCvSkillForm } from '../_hooks/useCvSkillForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../_hooks/useCvSkillForm')

jest.mock('../../../../components/ui/SkillSelect', () => ({
  SkillSelect: ({
    selectedSkill,
    setSelectedSkill,
  }: {
    selectedSkill: string
    setSelectedSkill: (val: string) => void
  }) => (
    <div
      data-testid="skill-select"
      onClick={() => setSelectedSkill('New Skill')}
    >
      {selectedSkill}
    </div>
  ),
}))

jest.mock('../../../../components/ui/MasterySelect', () => ({
  MasterySelect: ({
    mastery,
    setMastery,
  }: {
    mastery: string
    setMastery: (val: string) => void
  }) => (
    <div data-testid="mastery-select" onClick={() => setMastery('Expert')}>
      {mastery}
    </div>
  ),
}))

jest.mock('../../ModalButtons', () => ({
  ModalButtons: ({ saving }: { saving: boolean }) => (
    <div data-testid="modal-buttons">{saving ? 'Saving...' : 'Idle'}</div>
  ),
}))

describe('CvSkillForm', () => {
  const mockHandleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())
  const mockSetSelectedSkill = jest.fn()
  const mockSetMastery = jest.fn()

  const mockHookReturn = {
    selectedSkill: 'TypeScript',
    availableSkills: [],
    mastery: 'Intermediate',
    saving: false,
    handleSubmit: mockHandleSubmit,
    setMastery: mockSetMastery,
    setSelectedSkill: mockSetSelectedSkill,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCvSkillForm as jest.Mock).mockReturnValue(mockHookReturn)
  })

  it('should render sub-components with data provided by the hook', () => {
    const mockSkill: SkillMastery = {
      name: 'TypeScript',
      mastery: 'Intermediate',
    } as unknown as SkillMastery
    render(<CvSkillForm skill={mockSkill} />)

    expect(useCvSkillForm).toHaveBeenCalledWith(mockSkill)
    expect(screen.getByTestId('skill-select')).toHaveTextContent('TypeScript')
    expect(screen.getByTestId('mastery-select')).toHaveTextContent(
      'Intermediate',
    )
    expect(screen.getByTestId('modal-buttons')).toHaveTextContent('Idle')
  })

  it('should pass setter functions to Select components', () => {
    render(<CvSkillForm skill={undefined} />)

    fireEvent.click(screen.getByTestId('skill-select'))
    expect(mockSetSelectedSkill).toHaveBeenCalledWith('New Skill')

    fireEvent.click(screen.getByTestId('mastery-select'))
    expect(mockSetMastery).toHaveBeenCalledWith('Expert')
  })

  it('should call handleSubmit when the form is submitted', () => {
    const { container } = render(<CvSkillForm skill={undefined} />)
    const form = container.querySelector('form')

    if (form) {
      fireEvent.submit(form)
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should show saving state in ModalButtons when saving is true', () => {
    ;(useCvSkillForm as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      saving: true,
    })

    render(<CvSkillForm skill={undefined} />)
    expect(screen.getByTestId('modal-buttons')).toHaveTextContent('Saving...')
  })
})
