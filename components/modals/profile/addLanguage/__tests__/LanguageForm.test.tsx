import { useModalStore } from '@/store/modalStore'
import { GetLanguagesData, Language } from '@/types/lang'
import { ApolloCache, DefaultContext } from '@apollo/client'
import {
  MutationTuple,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { LanguageForm } from '../LanguageForm'

jest.mock('@apollo/client/react')
jest.mock('../../../../../store/modalStore')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('../../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="Loader" />,
}))

jest.mock('../../../../../components/ui/select/Select', () => ({
  Select: ({
    children,
    handleChange,
    name,
    id,
  }: {
    children: React.ReactNode
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    name: string
    id: string
  }) => (
    <select data-testid={id} name={name} onChange={handleChange}>
      <option value="">Select</option>
      {children}
    </select>
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
const mockUseTranslations = useTranslations as jest.Mock

describe('LanguageForm', () => {
  let mockCloseModal: jest.Mock
  let mockAddLanguage: jest.Mock

  const mockUserLanguages = [{ name: 'English' }]
  const mockLanguagesData: GetLanguagesData = {
    languages: [
      { id: '1', name: 'English' },
      { id: '2', name: 'Spanish' },
      { id: '3', name: 'French' },
    ] as Language[],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCloseModal = jest.fn()
    mockAddLanguage = jest.fn()

    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseModalStore.mockReturnValue({ closeModal: mockCloseModal })

    mockUseQuery.mockReturnValue({
      data: mockLanguagesData,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetLanguagesData>)

    mockUseMutation.mockReturnValue([
      mockAddLanguage,
      { loading: false },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)
  })

  it('should render the Loader when query is loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetLanguagesData>)

    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)
    expect(screen.getByTestId('Loader')).toBeInTheDocument()
  })

  it('should render error message when query fails', () => {
    const mockError = new Error('GraphQL Error')
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as unknown as QueryResult<GetLanguagesData>)

    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)
    expect(screen.getByText('errorOccurred GraphQL Error')).toBeInTheDocument()
  })

  it('should filter out languages that the user already has', () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)

    expect(screen.queryByText('English')).not.toBeInTheDocument()
    expect(screen.getByText('Spanish')).toBeInTheDocument()
    expect(screen.getByText('French')).toBeInTheDocument()
  })

  it('should update proficiency state on select change', () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)
    const proficiencySelect = screen.getByTestId('profeciency')

    fireEvent.change(proficiencySelect, { target: { value: 'B2' } })

    expect((proficiencySelect as HTMLSelectElement).value).toBe('B2')
  })

  it('should update selected language state on select change', () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)
    const languageSelect = screen.getByTestId('language')

    fireEvent.change(languageSelect, { target: { value: 'Spanish' } })

    expect((languageSelect as HTMLSelectElement).value).toBe('Spanish')
  })

  it('should prevent submission if no language is selected', async () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)

    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockAddLanguage).not.toHaveBeenCalled()
  })

  it('should prevent submission if no userId is provided', async () => {
    render(<LanguageForm userLanguages={mockUserLanguages} />)

    const languageSelect = screen.getByTestId('language')
    fireEvent.change(languageSelect, { target: { value: 'Spanish' } })

    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockAddLanguage).not.toHaveBeenCalled()
  })

  it('should submit the form and close modal on success', async () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)

    const languageSelect = screen.getByTestId('language')
    fireEvent.change(languageSelect, { target: { value: 'Spanish' } })

    const proficiencySelect = screen.getByTestId('profeciency')
    fireEvent.change(proficiencySelect, { target: { value: 'C1' } })

    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockAddLanguage).toHaveBeenCalledWith({
        variables: {
          language: {
            userId: 'user-123',
            name: 'Spanish',
            proficiency: 'C1',
          },
        },
      })
    })

    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should catch error without crashing on failed mutation', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddLanguage.mockRejectedValue(new Error('Mutation failed'))

    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)

    const languageSelect = screen.getByTestId('language')
    fireEvent.change(languageSelect, { target: { value: 'Spanish' } })

    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockAddLanguage).toHaveBeenCalled()
    })

    expect(mockCloseModal).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'errorOccurred',
      new Error('Mutation failed'),
    )

    consoleSpy.mockRestore()
  })

  it('should disable submit button when form is pristine', () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)
    expect(screen.getByTestId('submit-btn')).toBeDisabled()
  })

  it('should enable submit button when language is selected', () => {
    render(<LanguageForm userLanguages={mockUserLanguages} userId="user-123" />)

    const languageSelect = screen.getByTestId('language')
    fireEvent.change(languageSelect, { target: { value: 'French' } })

    expect(screen.getByTestId('submit-btn')).not.toBeDisabled()
  })
})
