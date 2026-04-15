import { fireEvent, render, screen } from '@testing-library/react'
import { SearchableSelect } from '../SearchableSelect'
import { useSearchableSelect } from '../_hooks/useSearchableSelect'

jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down" className={className} />
  ),
  X: () => <div data-testid="x-icon" />,
}))

jest.mock('../_hooks/useSearchableSelect')

jest.mock('../SearchableSelectMenu', () => ({
  SearchableSelectMenu: ({
    isOpen,
    value,
  }: {
    isOpen: boolean
    value: string
  }) => (
    <div
      data-testid="SearchableSelectMenu"
      data-is-open={isOpen}
      data-value={value}
    />
  ),
}))

const mockUseSearchableSelect = useSearchableSelect as jest.Mock

describe('SearchableSelect', () => {
  const mockOnChange = jest.fn()
  const mockSetIsOpen = jest.fn()
  const mockHandleInputChange = jest.fn()
  const mockHandleClear = jest.fn()
  const mockHandleToggleDropdown = jest.fn()
  const mockHandleOptionSelect = jest.fn()

  const defaultProps = {
    inputId: 'test-select',
    label: 'Test Label',
    name: 'testName',
    value: '',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ],
    onChange: mockOnChange,
  }

  const defaultHookReturn = {
    isOpen: false,
    displayValue: '',
    filteredOptions: defaultProps.options,
    wrapperRef: { current: null },
    setIsOpen: mockSetIsOpen,
    handleInputChange: mockHandleInputChange,
    handleClear: mockHandleClear,
    handleToggleDropdown: mockHandleToggleDropdown,
    handleOptionSelect: mockHandleOptionSelect,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearchableSelect.mockReturnValue(defaultHookReturn)
  })

  it('renders correctly with required props', () => {
    render(<SearchableSelect {...defaultProps} />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'test-select')
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('SearchableSelectMenu')).toBeInTheDocument()
  })

  it('calls setIsOpen(true) when input is focused', () => {
    render(<SearchableSelect {...defaultProps} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    expect(mockSetIsOpen).toHaveBeenCalledWith(true)
  })

  it('calls handleInputChange when input value changes', () => {
    render(<SearchableSelect {...defaultProps} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Op' } })

    expect(mockHandleInputChange).toHaveBeenCalledTimes(1)
  })

  it('displays clear button when displayValue is present and calls handleClear on click', () => {
    mockUseSearchableSelect.mockReturnValue({
      ...defaultHookReturn,
      displayValue: 'Option 1',
    })

    render(<SearchableSelect {...defaultProps} />)

    const clearButton = screen.getByTitle('Clear selection')
    expect(clearButton).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(mockHandleClear).toHaveBeenCalledTimes(1)
  })

  it('calls handleToggleDropdown when chevron button is clicked', () => {
    render(<SearchableSelect {...defaultProps} />)

    const toggleButton = screen.getByTestId('chevron-down').closest('button')
    if (toggleButton) {
      fireEvent.click(toggleButton)
    }

    expect(mockHandleToggleDropdown).toHaveBeenCalledTimes(1)
  })

  it('applies rotate-180 class to ChevronDown when isOpen is true', () => {
    mockUseSearchableSelect.mockReturnValue({
      ...defaultHookReturn,
      isOpen: true,
    })

    render(<SearchableSelect {...defaultProps} />)

    const chevron = screen.getByTestId('chevron-down')
    expect(chevron).toHaveClass('rotate-180')
  })

  it('applies disabled styles and attributes when disabled is true', () => {
    mockUseSearchableSelect.mockReturnValue({
      ...defaultHookReturn,
      displayValue: 'Option 1',
    })

    render(<SearchableSelect {...defaultProps} disabled={true} />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()

    const clearButton = screen.getByTitle('Clear selection')
    expect(clearButton).toBeDisabled()

    const toggleButton = screen.getByTestId('chevron-down').closest('button')
    expect(toggleButton).toBeDisabled()
  })

  it('applies required attribute correctly based on required prop and value', () => {
    const { rerender } = render(
      <SearchableSelect {...defaultProps} required={true} value="" />,
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()

    rerender(<SearchableSelect {...defaultProps} required={true} value="1" />)
    expect(input).not.toBeRequired()
  })
})
