import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useModalStore } from '@/store/modalStore'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ProfileSkillModal } from '../SkillModal'

jest.mock('@/lib/hooks/userHooks/useUser')
jest.mock('../../../../../store/modalStore')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('../../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="loader" />,
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

jest.mock('../SkillForm', () => ({
  SkillForm: ({
    userSkills,
    userId,
  }: {
    userSkills: string[]
    userId: string
  }) => (
    <div data-testid="skill-form">
      <span>User ID: {userId}</span>
      <span>Skills count: {userSkills.length}</span>
    </div>
  ),
}))

describe('ProfileSkillModal', () => {
  const mockUseUser = useUser as jest.Mock
  const mockUseModalStore = useModalStore as unknown as jest.Mock
  const mockUseTranslations = useTranslations as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('should render Loader when isLoading is true', () => {
    mockUseModalStore.mockReturnValue({ data: { id: '123' } })
    mockUseUser.mockReturnValue({ user: null, isLoading: true, error: null })

    render(<ProfileSkillModal />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should render error state when there is an error', () => {
    const errorMessage = 'Failed to fetch user'
    mockUseModalStore.mockReturnValue({ data: { id: '123' } })
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      error: { message: errorMessage },
    })

    render(<ProfileSkillModal />)

    expect(screen.getByText('errorOccurred')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should render error state when user is not found', () => {
    mockUseModalStore.mockReturnValue({ data: { id: '123' } })
    mockUseUser.mockReturnValue({ user: null, isLoading: false, error: null })

    render(<ProfileSkillModal />)

    expect(screen.getByText('errorOccurred')).toBeInTheDocument()
  })

  it('should render SkillForm with correct props when user is loaded successfully', () => {
    const mockUser = {
      id: 'user-789',
      profile: {
        skills: ['React', 'TypeScript'],
      },
    }
    mockUseModalStore.mockReturnValue({ data: { id: 'user-789' } })
    mockUseUser.mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: null,
    })

    render(<ProfileSkillModal />)

    expect(screen.getByText('addSkill')).toBeInTheDocument()
    expect(screen.getByTestId('skill-form')).toBeInTheDocument()
    expect(screen.getByText('User ID: user-789')).toBeInTheDocument()
    expect(screen.getByText('Skills count: 2')).toBeInTheDocument()
  })

  it('should handle undefined modal data gracefully', () => {
    mockUseModalStore.mockReturnValue({ data: undefined })
    mockUseUser.mockReturnValue({ user: null, isLoading: false, error: null })

    render(<ProfileSkillModal />)

    expect(mockUseUser).toHaveBeenCalledWith(undefined)
    expect(screen.getByText('errorOccurred')).toBeInTheDocument()
  })
})
