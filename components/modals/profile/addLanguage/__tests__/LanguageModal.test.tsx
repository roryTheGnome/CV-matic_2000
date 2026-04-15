import { render, screen } from '@testing-library/react'

import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'

import { User } from '@/types/user'
import React from 'react'
import { LanguageForm } from '../LanguageForm'
import { ProfileLanguageModal } from '../LanguageModal'

jest.mock('../../../../../components/modals/ModalLayout', () => ({
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

jest.mock('../../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="Loader" />,
}))

jest.mock('../LanguageForm', () => ({
  LanguageForm: jest.fn(() => <div data-testid="LanguageForm" />),
}))

jest.mock('../../../../../lib/hooks/userHooks/useUser')
jest.mock('../../../../../store/modalStore')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

const mockUseUser = useUser as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockLanguageForm = LanguageForm as jest.Mock

describe('ProfileLanguageModal', () => {
  const mockUser = {
    id: 'user-123',
    profile: {
      languages: [{ name: 'English' }, { name: 'Spanish' }],
    },
  } as unknown as User

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseModalStore.mockReturnValue({
      data: { id: 'user-123' },
    })
  })

  it('renders the Loader component when user data is loading', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: true,
      error: undefined,
    })

    render(<ProfileLanguageModal />)

    expect(screen.getByTestId('Loader')).toBeInTheDocument()
    expect(screen.queryByTestId('ModalLayout')).not.toBeInTheDocument()
  })

  it('renders an error message when there is an error fetching user data', () => {
    const mockError = new Error('Failed to fetch user')
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      error: mockError,
    })

    render(<ProfileLanguageModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
    expect(screen.getByText('Failed to fetch user')).toBeInTheDocument()
    expect(screen.queryByTestId('LanguageForm')).not.toBeInTheDocument()
  })

  it('renders an error layout when user data is missing but no explicit error is thrown', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      error: undefined,
    })

    render(<ProfileLanguageModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
    expect(screen.queryByTestId('LanguageForm')).not.toBeInTheDocument()
  })

  it('renders the ModalLayout and LanguageForm when user data is successfully loaded', () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: undefined,
    })

    render(<ProfileLanguageModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'addLanguage',
    )
    expect(screen.getByTestId('LanguageForm')).toBeInTheDocument()

    expect(MockLanguageForm).toHaveBeenCalledWith(
      {
        userLanguages: [{ name: 'English' }, { name: 'Spanish' }],
        userId: 'user-123',
      },
      undefined,
    )
  })

  it('handles the absence of modalData gracefully', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
    })
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      error: new Error('No user id provided'),
    })

    render(<ProfileLanguageModal />)

    expect(mockUseUser).toHaveBeenCalledWith(undefined)
    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
  })
})
