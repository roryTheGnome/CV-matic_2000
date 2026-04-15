import { fireEvent, render, screen } from '@testing-library/react'
import { useMultiSelectField } from '../_hooks/useMultiSelecrField'
import { MultiSelectField, SelectOption } from '../MultiSelectField'

jest.mock('../_hooks/useMultiSelecrField')
jest.mock('../MultiSelectFieldMenu', () => ({
  MultiSelectFieldMenu: ({
    isOpen,
    options,
    selectedNames,
  }: {
    isOpen: boolean
    options: SelectOption[]
    selectedNames: string[]
  }) => (
    <div data-testid="multi-select-menu">
      {isOpen ? 'Menu Open' : 'Menu Closed'}
      <div data-testid="menu-options-count">{options.length}</div>
      <div data-testid="menu-selected-count">{selectedNames.length}</div>
    </div>
  ),
}))

jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-icon" className={className} />
  ),
  X: () => <div data-testid="x-icon" />,
}))

describe('MultiSelectField', () => {
  const mockOnChange = jest.fn()
  const mockOnFocus = jest.fn()
  const mockHandleToggleMenu = jest.fn()
  const mockRemoveTag = jest.fn()
  const mockToggleOption = jest.fn()

  const defaultProps = {
    label: 'Skills',
    inputId: 'skills-input',
    name: 'skills',
    value: 'React,TypeScript',
    options: [
      { id: '1', name: 'React' },
      { id: '2', name: 'TypeScript' },
      { id: '3', name: 'Node.js' },
    ],
    onChange: mockOnChange,
    onFocus: mockOnFocus,
  }

  const mockHookValues = {
    containerRef: { current: null },
    isOpen: false,
    isFilled: true,
    selectedNames: ['React', 'TypeScript'],
    disabled: false,
    handleToggleMenu: mockHandleToggleMenu,
    removeTag: mockRemoveTag,
    toggleOption: mockToggleOption,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useMultiSelectField as jest.Mock).mockReturnValue(mockHookValues)
  })

  it('should render the label correctly', () => {
    render(<MultiSelectField {...defaultProps} />)
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('should render selected tags based on selectedNames', () => {
    render(<MultiSelectField {...defaultProps} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getAllByTestId('x-icon')).toHaveLength(2)
  })

  it('should call handleToggleMenu when the field is clicked and not disabled', () => {
    render(<MultiSelectField {...defaultProps} />)
    const clickableArea = screen.getByText('Skills').closest('div')
    if (clickableArea) fireEvent.click(clickableArea)
    expect(mockHandleToggleMenu).toHaveBeenCalledTimes(1)
  })

  it('should not call handleToggleMenu when clicked if disabled', () => {
    ;(useMultiSelectField as jest.Mock).mockReturnValue({
      ...mockHookValues,
      disabled: true,
    })
    render(<MultiSelectField {...defaultProps} />)
    const clickableArea = screen.getByText('Skills').closest('div')
    if (clickableArea) fireEvent.click(clickableArea)
    expect(mockHandleToggleMenu).not.toHaveBeenCalled()
  })

  it('should call removeTag when a tag remove button is clicked', () => {
    render(<MultiSelectField {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button')
    fireEvent.click(removeButtons[0])
    expect(mockRemoveTag).toHaveBeenCalled()
  })

  it('should pass correct props to MultiSelectFieldMenu', () => {
    render(<MultiSelectField {...defaultProps} />)
    expect(screen.getByTestId('multi-select-menu')).toHaveTextContent(
      'Menu Closed',
    )
    expect(screen.getByTestId('menu-options-count')).toHaveTextContent('3')
    expect(screen.getByTestId('menu-selected-count')).toHaveTextContent('2')
  })

  it('should show open state in menu and rotate chevron when isOpen is true', () => {
    ;(useMultiSelectField as jest.Mock).mockReturnValue({
      ...mockHookValues,
      isOpen: true,
    })
    render(<MultiSelectField {...defaultProps} />)

    expect(screen.getByTestId('multi-select-menu')).toHaveTextContent(
      'Menu Open',
    )

    const chevron = screen.getByTestId('chevron-icon')
    expect(chevron).toHaveClass('rotate-180')
  })

  it('should apply correct label styles when isFilled is false and menu is closed', () => {
    ;(useMultiSelectField as jest.Mock).mockReturnValue({
      ...mockHookValues,
      isFilled: false,
      isOpen: false,
      selectedNames: [],
    })
    render(<MultiSelectField {...defaultProps} />)
    const label = screen.getByText('Skills')
    expect(label).toHaveClass('text-base')
    expect(label).not.toHaveClass('text-xs')
  })
})
