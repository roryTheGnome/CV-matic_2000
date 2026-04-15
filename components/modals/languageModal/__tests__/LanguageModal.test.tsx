import { client } from '@/lib/apollo-client'
import { useModalStore } from '@/store/modalStore'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { LanguageModal } from '../LanguageModal'

import { LanguageItem } from '@/types/languages'
import React from 'react'
import { LanguageForm } from '../LanguageForm'

jest.mock('../../../../store/modalStore')
jest.mock('../../../../api/graphql/queries/languages', () => ({
  LANGUAGES_FRAGMENT: 'LANGUAGES_FRAGMENT',
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
jest.mock('../LanguageForm', () => ({
  LanguageForm: jest.fn(() => <div data-testid="LanguageForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockReadFragment = client.readFragment as jest.Mock
const MockLanguageForm = LanguageForm as jest.Mock

describe('LanguageModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders correctly in create mode with empty initial data', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'LANGUAGE_CREATE',
    })

    render(<LanguageModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'languageCreateModal',
    )
    expect(mockReadFragment).not.toHaveBeenCalled()
    expect(MockLanguageForm).toHaveBeenCalledWith(
      {
        initialData: { name: '', iso2: '', native_name: '' },
        languageId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode and fetches data from apollo cache', () => {
    const cachedLanguage: LanguageItem = {
      id: 'lang-1',
      name: 'English',
      iso2: 'EN',
      native_name: 'English',
      created_at: '',
    }

    mockUseModalStore.mockReturnValue({
      data: { id: 'lang-1' },
      type: 'LANGUAGE_EDIT',
    })
    mockReadFragment.mockReturnValue(cachedLanguage)

    render(<LanguageModal />)

    expect(mockReadFragment).toHaveBeenCalledWith({
      id: 'Language:lang-1',
      fragment: 'LANGUAGES_FRAGMENT',
    })

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'languageEditModal',
    )

    expect(MockLanguageForm).toHaveBeenCalledWith(
      {
        initialData: {
          name: 'English',
          iso2: 'EN',
          native_name: 'English',
        },
        languageId: 'lang-1',
      },
      undefined,
    )
  })

  it('renders correctly in edit mode when cached data is not found', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'lang-2' },
      type: 'LANGUAGE_EDIT',
    })
    mockReadFragment.mockReturnValue(null)

    render(<LanguageModal />)

    expect(mockReadFragment).toHaveBeenCalledWith({
      id: 'Language:lang-2',
      fragment: 'LANGUAGES_FRAGMENT',
    })

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'languageEditModal',
    )

    expect(MockLanguageForm).toHaveBeenCalledWith(
      {
        initialData: { name: '', iso2: '', native_name: '' },
        languageId: 'lang-2',
      },
      undefined,
    )
  })
})
