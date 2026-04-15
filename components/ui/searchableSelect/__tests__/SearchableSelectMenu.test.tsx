import { fireEvent, render, screen } from '@testing-library/react'
import { SelectOption } from '../SearchableSelect'
import { SearchableSelectMenu } from '../SearchableSelectMenu'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('SearchableSelectMenu', () => {
  const mockOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]
  const mockHandleOptionSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render nothing when isOpen is false', () => {
    const { container } = render(
      <SearchableSelectMenu
        isOpen={false}
        filteredOptions={mockOptions}
        value=""
        handleOptionSelect={mockHandleOptionSelect}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render list of options when isOpen is true and options exist', () => {
    render(
      <SearchableSelectMenu
        isOpen={true}
        filteredOptions={mockOptions}
        value=""
        handleOptionSelect={mockHandleOptionSelect}
      />,
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.queryByText('notFound')).not.toBeInTheDocument()
  })

  it('should render notFound message when isOpen is true and options are empty', () => {
    render(
      <SearchableSelectMenu
        isOpen={true}
        filteredOptions={[]}
        value=""
        handleOptionSelect={mockHandleOptionSelect}
      />,
    )

    expect(screen.getByText('notFound')).toBeInTheDocument()
  })

  it('should highlight the selected option based on value prop', () => {
    render(
      <SearchableSelectMenu
        isOpen={true}
        filteredOptions={mockOptions}
        value="1"
        handleOptionSelect={mockHandleOptionSelect}
      />,
    )

    const selectedOption = screen.getByText('Option 1')
    expect(selectedOption).toHaveClass('text-primary')
    expect(selectedOption).toHaveClass('font-medium')

    const unselectedOption = screen.getByText('Option 2')
    expect(unselectedOption).toHaveClass('text-text-primary')
    expect(unselectedOption).not.toHaveClass('text-primary')
  })

  it('should call handleOptionSelect when an option is clicked', () => {
    render(
      <SearchableSelectMenu
        isOpen={true}
        filteredOptions={mockOptions}
        value=""
        handleOptionSelect={mockHandleOptionSelect}
      />,
    )

    fireEvent.click(screen.getByText('Option 1'))
    expect(mockHandleOptionSelect).toHaveBeenCalledTimes(1)
    expect(mockHandleOptionSelect).toHaveBeenCalledWith(mockOptions[0])
  })
})
