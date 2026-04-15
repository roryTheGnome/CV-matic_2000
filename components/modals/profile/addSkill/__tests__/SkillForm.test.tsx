import { useModalStore } from '@/store/modalStore'
import { GetSkillsData, Mastery, SkillItem } from '@/types/skills'
import { ApolloCache, DefaultContext } from '@apollo/client'
import {
  MutationTuple,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SkillForm } from '../SkillForm'

jest.mock('@apollo/client/react')
jest.mock('../../../../../store/modalStore')

jest.mock('../../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="Loader" />,
}))

jest.mock('../../../../../components/ui/SkillSelect', () => ({
  SkillSelect: ({
    setSelectedSkill,
    availableSkills,
  }: {
    setSelectedSkill: (skill: Partial<SkillItem>) => void
    availableSkills: SkillItem[]
  }) => (
    <div data-testid="SkillSelect">
      <span data-testid="available-count">{availableSkills.length}</span>
      <button
        type="button"
        data-testid="select-skill-btn"
        onClick={() => setSelectedSkill(availableSkills[0])}
      >
        Select First
      </button>
    </div>
  ),
}))

jest.mock('../../../../../components/ui/MasterySelect', () => ({
  MasterySelect: ({
    setMastery,
  }: {
    setMastery: (mastery: Mastery) => void
  }) => (
    <div data-testid="MasterySelect">
      <button
        type="button"
        data-testid="select-mastery-btn"
        onClick={() => setMastery('Expert')}
      >
        Set Expert
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

const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('SkillForm', () => {
  let mockCloseModal: jest.Mock
  let mockAddSkill: jest.Mock

  const mockUserSkills = [{ name: 'React' }]
  const mockSkillsData: GetSkillsData = {
    skills: [
      { id: '1', name: 'React', category: { id: 'cat-1', name: 'Frontend' } },
      {
        id: '2',
        name: 'TypeScript',
        category: { id: 'cat-1', name: 'Frontend' },
      },
      { id: '3', name: 'Node.js', category: { id: 'cat-2', name: 'Backend' } },
    ] as unknown as SkillItem[],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCloseModal = jest.fn()
    mockAddSkill = jest.fn()

    mockUseModalStore.mockReturnValue({ closeModal: mockCloseModal })

    mockUseQuery.mockReturnValue({
      data: mockSkillsData,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetSkillsData>)

    mockUseMutation.mockReturnValue([
      mockAddSkill,
      { loading: false },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)
  })

  it('should render the Loader when query is loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetSkillsData>)

    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)
    expect(screen.getByTestId('Loader')).toBeInTheDocument()
  })

  it('should render error message when query fails', () => {
    const mockError = new Error('GraphQL Error')
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as unknown as QueryResult<GetSkillsData>)

    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)
    expect(screen.getByText('Error: GraphQL Error')).toBeInTheDocument()
  })

  it('should filter out skills that the user already has', () => {
    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)

    expect(screen.getByTestId('available-count')).toHaveTextContent('2')
  })

  it('should prevent submission if no skill is selected', () => {
    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)

    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockAddSkill).not.toHaveBeenCalled()
  })

  it('should prevent submission if no userId is provided', () => {
    render(<SkillForm userSkills={mockUserSkills} />)

    fireEvent.click(screen.getByTestId('select-skill-btn'))
    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockAddSkill).not.toHaveBeenCalled()
  })

  it('should submit the form with selected skill and mastery, then close modal', async () => {
    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)

    fireEvent.click(screen.getByTestId('select-skill-btn'))
    fireEvent.click(screen.getByTestId('select-mastery-btn'))

    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockAddSkill).toHaveBeenCalledWith({
        variables: {
          skill: {
            userId: 'user-123',
            name: 'TypeScript',
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
    mockAddSkill.mockRejectedValue(new Error('Mutation failed'))

    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)

    fireEvent.click(screen.getByTestId('select-skill-btn'))
    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockAddSkill).toHaveBeenCalled()
    })

    expect(mockCloseModal).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'BIG NO NO:',
      new Error('Mutation failed'),
    )

    consoleSpy.mockRestore()
  })

  it('should disable submit button when form is pristine', () => {
    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)
    expect(screen.getByTestId('submit-btn')).toBeDisabled()
  })

  it('should enable submit button when skill is selected', () => {
    render(<SkillForm userSkills={mockUserSkills} userId="user-123" />)

    fireEvent.click(screen.getByTestId('select-skill-btn'))

    expect(screen.getByTestId('submit-btn')).not.toBeDisabled()
  })
})
