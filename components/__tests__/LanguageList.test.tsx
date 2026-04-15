import { fireEvent, render, screen } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import { LanguageProficiency } from '@/types/lang'
import React from 'react'
import { LanguageList } from '../LanguageList'

jest.mock('../../store/modalStore', () => ({
  useModalStore: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="plus-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
}))

interface ButtonMockProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: React.ElementType
  isTextButton?: boolean
}

jest.mock('../../components/ui/Button', () => ({
  Button: ({ children, onClick, className, disabled }: ButtonMockProps) => (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  ),
}))

describe('LanguageList', () => {
  const mockOpenModal = jest.fn()
  const mockOnDelete = jest.fn()

  const mockLanguages: LanguageProficiency[] = [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'B2' },
    { name: 'French', proficiency: 'A1' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
    })
  })

  it('should render the list of languages and proficiencies', () => {
    render(<LanguageList languages={mockLanguages} owner={false} />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Native')).toBeInTheDocument()
    expect(screen.getByText('Spanish')).toBeInTheDocument()
    expect(screen.getByText('B2')).toBeInTheDocument()
    expect(screen.getByText('French')).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
  })

  it('should not render action buttons if owner is false', () => {
    render(<LanguageList languages={mockLanguages} owner={false} />)

    expect(screen.queryByText('addLanguage')).not.toBeInTheDocument()
    expect(screen.queryByText('removeLanguage')).not.toBeInTheDocument()
  })

  it('should not trigger openModal on language click if owner is false', () => {
    render(<LanguageList languages={mockLanguages} owner={false} />)

    fireEvent.click(screen.getByText('English'))

    expect(mockOpenModal).not.toHaveBeenCalled()
  })

  it('should render action buttons if owner is true', () => {
    render(<LanguageList languages={mockLanguages} owner={true} />)

    expect(screen.getByText('addLanguage')).toBeInTheDocument()
    expect(screen.getByText('removeLanguage')).toBeInTheDocument()
  })

  it('should trigger openModal with PROFILE_LANGUAGE_ADD when addLanguage is clicked', () => {
    render(
      <LanguageList languages={mockLanguages} owner={true} userId="user-123" />,
    )

    fireEvent.click(screen.getByText('addLanguage'))

    expect(mockOpenModal).toHaveBeenCalledWith('PROFILE_LANGUAGE_ADD', {
      id: 'user-123',
    })
  })

  it('should trigger openModal with PROFILE_LANGUAGE_EDIT when a language is clicked', () => {
    render(
      <LanguageList languages={mockLanguages} owner={true} userId="user-123" />,
    )

    fireEvent.click(screen.getByText('Spanish'))

    expect(mockOpenModal).toHaveBeenCalledWith('PROFILE_LANGUAGE_EDIT', {
      language: mockLanguages[1],
      id: 'user-123',
    })
  })

  it('should enter delete mode when removeLanguage is clicked', () => {
    render(<LanguageList languages={mockLanguages} owner={true} />)

    fireEvent.click(screen.getByText('removeLanguage'))

    expect(screen.getByText('cancel')).toBeInTheDocument()
    expect(screen.getByText('confirm (0)')).toBeInTheDocument()
    expect(screen.queryByText('addLanguage')).not.toBeInTheDocument()
  })

  it('should select and deselect languages in delete mode', () => {
    render(<LanguageList languages={mockLanguages} owner={true} />)

    fireEvent.click(screen.getByText('removeLanguage'))

    fireEvent.click(screen.getByText('English'))
    expect(screen.getByText('confirm (1)')).toBeInTheDocument()

    fireEvent.click(screen.getByText('French'))
    expect(screen.getByText('confirm (2)')).toBeInTheDocument()

    fireEvent.click(screen.getByText('English'))
    expect(screen.getByText('confirm (1)')).toBeInTheDocument()
  })

  it('should call onDelete with selected languages and exit delete mode on confirm', () => {
    render(
      <LanguageList
        languages={mockLanguages}
        owner={true}
        onDelete={mockOnDelete}
      />,
    )

    fireEvent.click(screen.getByText('removeLanguage'))
    fireEvent.click(screen.getByText('Spanish'))
    fireEvent.click(screen.getByText('French'))

    fireEvent.click(screen.getByText('confirm (2)'))

    expect(mockOnDelete).toHaveBeenCalledWith(['Spanish', 'French'])
    expect(screen.queryByText('cancel')).not.toBeInTheDocument()
    expect(screen.getByText('addLanguage')).toBeInTheDocument()
  })

  it('should exit delete mode and clear selection when cancel is clicked', () => {
    render(
      <LanguageList
        languages={mockLanguages}
        owner={true}
        onDelete={mockOnDelete}
      />,
    )

    fireEvent.click(screen.getByText('removeLanguage'))
    fireEvent.click(screen.getByText('English'))

    expect(screen.getByText('confirm (1)')).toBeInTheDocument()

    fireEvent.click(screen.getByText('cancel'))

    expect(screen.queryByText('cancel')).not.toBeInTheDocument()
    expect(screen.getByText('addLanguage')).toBeInTheDocument()

    fireEvent.click(screen.getByText('removeLanguage'))
    expect(screen.getByText('confirm (0)')).toBeInTheDocument()
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('should not call onDelete if no languages are selected on confirm', () => {
    render(
      <LanguageList
        languages={mockLanguages}
        owner={true}
        onDelete={mockOnDelete}
      />,
    )

    fireEvent.click(screen.getByText('removeLanguage'))
    fireEvent.click(screen.getByText('confirm (0)'))

    expect(mockOnDelete).not.toHaveBeenCalled()
    expect(screen.getByText('cancel')).toBeInTheDocument()
  })
})
