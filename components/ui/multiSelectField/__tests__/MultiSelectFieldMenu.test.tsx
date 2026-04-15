import { fireEvent, render, screen } from '@testing-library/react'
import { SelectOption } from '../MultiSelectField'
import { MultiSelectFieldMenu } from '../MultiSelectFieldMenu'

jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="check-icon" />,
}))

describe('MultiSelectFieldMenu', () => {
  const mockToggleOption = jest.fn()

  const defaultOptions: SelectOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={false}
        options={defaultOptions}
        selectedNames={[]}
        toggleOption={mockToggleOption}
      />,
    )

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByText('No options found')).not.toBeInTheDocument()
  })

  it('renders loading state when loading is true', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={true}
        loading={true}
        options={defaultOptions}
        selectedNames={[]}
        toggleOption={mockToggleOption}
      />,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('renders no options message when options array is empty', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={true}
        options={[]}
        selectedNames={[]}
        toggleOption={mockToggleOption}
      />,
    )

    expect(screen.getByText('No options found')).toBeInTheDocument()
  })

  it('renders all options when isOpen is true and not loading', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={true}
        options={defaultOptions}
        selectedNames={[]}
        toggleOption={mockToggleOption}
      />,
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('displays checkmark icon only for selected options', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={true}
        options={defaultOptions}
        selectedNames={['Option 1', 'Option 3']}
        toggleOption={mockToggleOption}
      />,
    )

    const checkIcons = screen.getAllByTestId('check-icon')
    expect(checkIcons).toHaveLength(2)
  })

  it('calls toggleOption with correct name when an option is clicked', () => {
    render(
      <MultiSelectFieldMenu
        isOpen={true}
        options={defaultOptions}
        selectedNames={[]}
        toggleOption={mockToggleOption}
      />,
    )

    fireEvent.click(screen.getByText('Option 2'))

    expect(mockToggleOption).toHaveBeenCalledTimes(1)
    expect(mockToggleOption).toHaveBeenCalledWith('Option 2')
  })
})
