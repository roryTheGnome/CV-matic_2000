import { useAuthStore } from '@/store/authStore'
import { ModalType, useModalStore } from '@/store/modalStore'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TableSearch } from '../TableSearch'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../../../store/modalStore', () => ({
  useModalStore: jest.fn(),
}))

jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
}))

jest.mock('../Button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

describe('TableSearch', () => {
  const mockSetSearch = jest.fn()
  const mockOpenModal = jest.fn()

  const defaultProps = {
    search: 'initial search',
    createButtonText: 'Create Item',
    typeOfCreateModal: 'USER_CREATE' as ModalType,
    userCanInteract: false,
    setSearch: mockSetSearch,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
    })
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAdmin: false,
    })
  })

  it('renders search input with correct value', () => {
    render(<TableSearch {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search..') as HTMLInputElement
    expect(input.value).toBe('initial search')
  })

  it('calls setSearch when input value changes', () => {
    render(<TableSearch {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search..')
    fireEvent.change(input, { target: { value: 'new search' } })
    expect(mockSetSearch).toHaveBeenCalledWith('new search')
  })

  it('renders create button if typeOfCreateModal is CV_PROJECT_ADD', () => {
    render(<TableSearch {...defaultProps} typeOfCreateModal="CV_PROJECT_ADD" />)
    expect(screen.getByText('Create Item')).toBeInTheDocument()
  })

  it('renders create button if user is admin', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({ isAdmin: true })
    render(<TableSearch {...defaultProps} />)
    expect(screen.getByText('Create Item')).toBeInTheDocument()
  })

  it('renders create button if userCanInteract is true', () => {
    render(<TableSearch {...defaultProps} userCanInteract={true} />)
    expect(screen.getByText('Create Item')).toBeInTheDocument()
  })

  it('does not render create button if not admin, cannot interact, and not CV_PROJECT_ADD', () => {
    render(<TableSearch {...defaultProps} />)
    expect(screen.queryByText('Create Item')).not.toBeInTheDocument()
  })

  it('calls openModal with correct type when button is clicked', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({ isAdmin: true })
    render(<TableSearch {...defaultProps} />)
    const button = screen.getByText('Create Item')
    fireEvent.click(button)
    expect(mockOpenModal).toHaveBeenCalledWith('USER_CREATE')
  })
})
