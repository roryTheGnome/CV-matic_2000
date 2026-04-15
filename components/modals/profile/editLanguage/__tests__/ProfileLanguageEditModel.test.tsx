import { render, screen } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ProfileLanguageEditModal } from '../ProfileLanguageEditModel'

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

jest.mock('../LanguageEditForm', () => ({
  LanguageEditForm: ({
    language,
    userId,
  }: {
    language: { name: string }
    userId?: string
  }) => (
    <div data-testid="language-edit-form">
      <span>Language: {language.name}</span>
      <span>User ID: {userId ?? 'none'}</span>
    </div>
  ),
}))

describe('ProfileLanguageEditModal', () => {
  const mockUseModalStore = useModalStore as unknown as jest.Mock
  const mockUseTranslations = useTranslations as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('should return null if language data is missing', () => {
    mockUseModalStore.mockReturnValue({
      data: {
        language: undefined,
        id: 'user-1',
      },
    })

    const { container } = render(<ProfileLanguageEditModal />)
    expect(container.firstChild).toBeNull()
  })

  it('should render ModalLayout and LanguageEditForm when language data is present', () => {
    const mockLanguage = { name: 'English', proficiency: 'C1' }
    const mockUserId = 'user-123'

    mockUseModalStore.mockReturnValue({
      data: {
        language: mockLanguage,
        id: mockUserId,
      },
    })

    render(<ProfileLanguageEditModal />)

    expect(screen.getByTestId('modal-layout')).toBeInTheDocument()
    expect(screen.getByText('editLanguage')).toBeInTheDocument()
    expect(screen.getByTestId('language-edit-form')).toBeInTheDocument()
    expect(
      screen.getByText(`Language: ${mockLanguage.name}`),
    ).toBeInTheDocument()
    expect(screen.getByText(`User ID: ${mockUserId}`)).toBeInTheDocument()
  })

  it('should handle missing userId gracefully', () => {
    const mockLanguage = { name: 'French' }

    mockUseModalStore.mockReturnValue({
      data: {
        language: mockLanguage,
        id: undefined,
      },
    })

    render(<ProfileLanguageEditModal />)

    expect(screen.getByText('User ID: none')).toBeInTheDocument()
  })
})
