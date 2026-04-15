import { useModalStore } from '@/store/modalStore'
import { LanguageProficiency } from '@/types/lang'
import { ApolloCache, DefaultContext } from '@apollo/client'
import { MutationTuple, useMutation } from '@apollo/client/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { LanguageEditForm } from '../LanguageEditForm'

jest.mock('@apollo/client/react')
jest.mock('../../../../../store/modalStore')

jest.mock('@/components/ui/select/Select', () => ({
  Select: ({
    children,
    handleChange,
    name,
    id,
    value,
  }: {
    children: React.ReactNode
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    name: string
    id: string
    value: string
  }) => (
    <select data-testid={id} name={name} value={value} onChange={handleChange}>
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

const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('LanguageEditForm', () => {
  let mockCloseModal: jest.Mock
  let mockUpdateLanguage: jest.Mock

  const mockLanguage: LanguageProficiency = {
    name: 'English',
    proficiency: 'B2',
  } as LanguageProficiency

  beforeEach(() => {
    jest.clearAllMocks()
    mockCloseModal = jest.fn()
    mockUpdateLanguage = jest.fn()

    mockUseModalStore.mockReturnValue({ closeModal: mockCloseModal })

    mockUseMutation.mockReturnValue([
      mockUpdateLanguage,
      { loading: false },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)
  })

  it('should render the language name and initial proficiency', () => {
    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)
    expect(screen.getByText('English')).toBeInTheDocument()
    const select = screen.getByTestId('proficiency') as HTMLSelectElement
    expect(select.value).toBe('B2')
  })

  it('should update proficiency state on select change', () => {
    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)
    const select = screen.getByTestId('proficiency')

    fireEvent.change(select, { target: { value: 'C1' } })

    expect((select as HTMLSelectElement).value).toBe('C1')
  })

  it('should enable submit button only when proficiency is changed', () => {
    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)
    const submitBtn = screen.getByTestId('submit-btn')

    expect(submitBtn).toBeDisabled()

    const select = screen.getByTestId('proficiency')
    fireEvent.change(select, { target: { value: 'C1' } })

    expect(submitBtn).not.toBeDisabled()

    fireEvent.change(select, { target: { value: 'B2' } })

    expect(submitBtn).toBeDisabled()
  })

  it('should prevent submission if no userId is provided', () => {
    render(<LanguageEditForm language={mockLanguage} />)

    const select = screen.getByTestId('proficiency')
    fireEvent.change(select, { target: { value: 'C1' } })
    fireEvent.submit(screen.getByTestId('submit-btn'))

    expect(mockUpdateLanguage).not.toHaveBeenCalled()
  })

  it('should submit the form with updated proficiency and close modal', async () => {
    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)

    const select = screen.getByTestId('proficiency')
    fireEvent.change(select, { target: { value: 'C1' } })
    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockUpdateLanguage).toHaveBeenCalledWith({
        variables: {
          language: {
            userId: 'user-123',
            name: 'English',
            proficiency: 'C1',
          },
        },
      })
    })

    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should catch error without crashing on failed mutation', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateLanguage.mockRejectedValue(new Error('Update failed'))

    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)

    const select = screen.getByTestId('proficiency')
    fireEvent.change(select, { target: { value: 'C1' } })
    fireEvent.submit(screen.getByTestId('submit-btn'))

    await waitFor(() => {
      expect(mockUpdateLanguage).toHaveBeenCalled()
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
      mockUpdateLanguage,
      { loading: true },
    ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>)

    render(<LanguageEditForm language={mockLanguage} userId="user-123" />)

    const select = screen.getByTestId('proficiency')
    fireEvent.change(select, { target: { value: 'C1' } })

    expect(screen.getByTestId('submit-btn')).toBeDisabled()
  })
})
