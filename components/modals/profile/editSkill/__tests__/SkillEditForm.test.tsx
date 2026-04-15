import { useModalStore } from '@/store/modalStore'
import { Mastery, SkillMastery } from '@/types/skills'
import { ApolloCache, DefaultContext } from '@apollo/client'
import { MutationTuple, useMutation } from '@apollo/client/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SkillEditForm } from '../SkillEditForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@apollo/client/react')
jest.mock('../../../../../store/modalStore')

jest.mock('../../../../../components/ui/MasterySelect', () => ({
  MasterySelect: ({
    mastery,
    setMastery,
  }: {
    mastery: Mastery
    setMastery: (mastery: Mastery) => void
  }) => (
    <div data-testid="MasterySelect" data-value={mastery}>
      <button
        type="button"
        data-testid="set-expert-btn"
        onClick={() => setMastery('Expert')}
      >
        Set Expert
      </button>
      <button
        type="button"
        data-testid="set-novice-btn"
        onClick={() => setMastery('Novice')}
      >
        Set Novice
      </button>
    </div>
  ),
}))

jest.mock('../../../ModalButtons', () => ({
  ModalButtons: ({
    isDirty,
    saving,
  }: {
    isDirty: boolean
    saving: boolean
  }) => (
    <button
      type="submit"
      data-testid="submit-btn"
      disabled={!isDirty || saving}
    >
      Submit
    </button>
  ),
}))

const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('SkillEditForm', () => {
  let mockCloseModal: jest.Mock
  let mockUpdateSkill: jest.Mock

  const mockSkill: SkillMastery = {
    name: 'React',
    categoryId: 'cat-1',
    mastery: 'Proficient',
  } as SkillMastery

  beforeEach(() => {
    jest.clearAllMocks()
    mockCloseModal = jest.fn()
    mockUpdateSkill = jest.fn()

    mockUseModalStore.mockReturnValue({ closeModal: mockCloseModal })

    mockUseMutation.mockReturnValue([
      mockUpdateSkill,
      { loading: false },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)
  })

  it('should render the skill name and initial mastery', () => {
    render(<SkillEditForm skill={mockSkill} userId="user-123" />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByTestId('MasterySelect')).toHaveAttribute(
      'data-value',
      'Proficient',
    )
  })

  it('should update mastery state when MasterySelect triggers change', () => {
    render(<SkillEditForm skill={mockSkill} userId="user-123" />)

    fireEvent.click(screen.getByTestId('set-expert-btn'))

    expect(screen.getByTestId('MasterySelect')).toHaveAttribute(
      'data-value',
      'Expert',
    )
  })

  it('should enable submit button only when mastery is changed', () => {
    render(<SkillEditForm skill={mockSkill} userId="user-123" />)
    const submitBtn = screen.getByTestId('submit-btn')

    expect(submitBtn).toBeDisabled()

    fireEvent.click(screen.getByTestId('set-expert-btn'))

    expect(submitBtn).not.toBeDisabled()

    fireEvent.click(screen.getByTestId('set-novice-btn'))

    expect(submitBtn).not.toBeDisabled()
  })

  it('should prevent submission if no userId is provided', () => {
    render(<SkillEditForm skill={mockSkill} />)

    fireEvent.click(screen.getByTestId('set-expert-btn'))
    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockUpdateSkill).not.toHaveBeenCalled()
  })

  it('should submit the form with updated mastery and close modal', async () => {
    render(<SkillEditForm skill={mockSkill} userId="user-123" />)

    fireEvent.click(screen.getByTestId('set-expert-btn'))
    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockUpdateSkill).toHaveBeenCalledWith({
        variables: {
          skill: {
            userId: 'user-123',
            name: 'React',
            categoryId: 'cat-1',
            mastery: 'Expert',
          },
        },
      })
    })

    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should catch error without crashing on failed mutation', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateSkill.mockRejectedValue(new Error('Update failed'))

    render(<SkillEditForm skill={mockSkill} userId="user-123" />)

    fireEvent.click(screen.getByTestId('set-expert-btn'))
    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockUpdateSkill).toHaveBeenCalled()
    })

    expect(mockCloseModal).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Update failed:',
      new Error('Update failed'),
    )

    consoleSpy.mockRestore()
  })

  it('should render loading state correctly through ModalButtons', () => {
    mockUseMutation.mockReturnValue([
      mockUpdateSkill,
      { loading: true },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)

    render(<SkillEditForm skill={mockSkill} userId="user-123" />)

    fireEvent.click(screen.getByTestId('set-expert-btn'))

    expect(screen.getByTestId('submit-btn')).toBeDisabled()
  })
})
