import { useTagInputField } from '@/components/ui/tagInputField/_hooks/useTagInputField'
import { TagInputField } from '@/components/ui/tagInputField/TagInputField'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock(
  '../../../../../../components/ui/tagInputField/_hooks/useTagInputField',
)
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
}))

describe('TagInputField', () => {
  const mockOnChange = jest.fn()
  const mockHandleInputChange = jest.fn()
  const mockHandleKeyDown = jest.fn()
  const mockRemoveTag = jest.fn()
  const mockFocusInput = jest.fn()
  const mockSetIsFocused = jest.fn()

  const defaultHookReturn = {
    inputValue: '',
    isFocused: false,
    isFilled: false,
    selectedNames: [],
    inputRef: { current: null },
    setIsFocused: mockSetIsFocused,
    handleInputChange: mockHandleInputChange,
    handleKeyDown: mockHandleKeyDown,
    removeTag: mockRemoveTag,
    focusInput: mockFocusInput,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTagInputField as jest.Mock).mockReturnValue(defaultHookReturn)
  })

  it('renders the label and helper text', () => {
    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText(/press/i)).toBeInTheDocument()
    expect(screen.getByText(/toAdd/i)).toBeInTheDocument()
  })

  it('renders selected tags', () => {
    ;(useTagInputField as jest.Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedNames: ['React', 'Jest'],
      isFilled: true,
    })

    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value="React,Jest"
        onChange={mockOnChange}
      />,
    )

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Jest')).toBeInTheDocument()
    expect(screen.getAllByTestId('x-icon')).toHaveLength(2)
  })

  it('calls handleInputChange when input value changes', () => {
    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    const input = screen.getByLabelText('Tags')
    fireEvent.change(input, { target: { value: 'new tag' } })
    expect(mockHandleInputChange).toHaveBeenCalled()
  })

  it('calls handleKeyDown on key press', () => {
    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    const input = screen.getByLabelText('Tags')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockHandleKeyDown).toHaveBeenCalled()
  })

  it('calls focusInput when container is clicked', () => {
    const { container } = render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    fireEvent.click(container.firstChild as HTMLElement)
    expect(mockFocusInput).toHaveBeenCalled()
  })

  it('calls removeTag when X button is clicked', () => {
    ;(useTagInputField as jest.Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedNames: ['React'],
    })

    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value="React"
        onChange={mockOnChange}
      />,
    )

    const removeButton = screen.getByRole('button')
    fireEvent.click(removeButton)
    expect(mockRemoveTag).toHaveBeenCalledWith('React')
  })

  it('applies focused styles when isFocused is true', () => {
    ;(useTagInputField as jest.Mock).mockReturnValue({
      ...defaultHookReturn,
      isFocused: true,
    })

    const { container } = render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    const borderContainer = container.querySelector('.border-primary')
    expect(borderContainer).toBeInTheDocument()
    expect(screen.getByText('Tags')).toHaveClass('text-primary')
  })

  it('disables the input and hides helper text when disabled prop is true', () => {
    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        disabled={true}
        onChange={mockOnChange}
      />,
    )

    const input = screen.getByLabelText('Tags')
    expect(input).toBeDisabled()
    expect(screen.queryByText(/press/i)).not.toBeInTheDocument()
  })

  it('triggers focus and blur states correctly', () => {
    render(
      <TagInputField
        label="Tags"
        inputId="tag-input"
        name="tags"
        value=""
        onChange={mockOnChange}
      />,
    )

    const input = screen.getByLabelText('Tags')
    fireEvent.focus(input)
    expect(mockSetIsFocused).toHaveBeenCalledWith(true)

    fireEvent.blur(input)
    expect(mockSetIsFocused).toHaveBeenCalledWith(false)
  })
})
