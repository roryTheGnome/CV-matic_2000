import { fireEvent, render, screen } from '@testing-library/react'
import { DatePickerField } from '../DatePickerField'

jest.mock('lucide-react', () => ({
  CalendarDaysIcon: () => <div data-testid="calendar-icon" />,
}))

describe('DatePickerField', () => {
  const defaultProps = {
    label: 'Select Date',
    inputId: 'date-input',
  }

  it('renders with correct label and input id', () => {
    render(<DatePickerField {...defaultProps} />)

    const input = screen.getByLabelText('Select Date')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'date-input')
    expect(input).toHaveAttribute('type', 'date')
  })

  it('applies custom className to the input', () => {
    render(<DatePickerField {...defaultProps} className="custom-class" />)

    const input = screen.getByLabelText('Select Date')
    expect(input).toHaveClass('custom-class')
  })

  it('displays the provided value', () => {
    render(<DatePickerField {...defaultProps} value="2023-10-27" readOnly />)

    const input = screen.getByLabelText('Select Date') as HTMLInputElement
    expect(input.value).toBe('2023-10-27')
  })

  it('calls onChange and updates internal filled state when value changes', () => {
    const handleChange = jest.fn()
    render(<DatePickerField {...defaultProps} onChange={handleChange} />)

    const input = screen.getByLabelText('Select Date')
    fireEvent.change(input, { target: { value: '2023-12-25' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveClass('text-current')
  })

  it('renders label in default position when empty', () => {
    render(<DatePickerField {...defaultProps} value="" />)

    const label = screen.getByText('Select Date')
    expect(label).toHaveClass('top-2.5')
    expect(label).not.toHaveClass('-top-2.5')
  })

  it('shifts label position when value is provided', () => {
    render(<DatePickerField {...defaultProps} value="2023-10-27" readOnly />)

    const label = screen.getByText('Select Date')
    expect(label).toHaveClass('-top-2.5')
    expect(label).toHaveClass('text-xs')
  })

  it('renders the calendar icon', () => {
    render(<DatePickerField {...defaultProps} />)

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })

  it('passes additional input props correctly', () => {
    render(<DatePickerField {...defaultProps} required disabled />)

    const input = screen.getByLabelText('Select Date')
    expect(input).toBeRequired()
    expect(input).toBeDisabled()
  })

  it('changes text transparency based on content', () => {
    const { rerender } = render(<DatePickerField {...defaultProps} value="" />)
    let input = screen.getByLabelText('Select Date')
    expect(input).toHaveClass('text-transparent')

    rerender(<DatePickerField {...defaultProps} value="2023-10-27" />)
    input = screen.getByLabelText('Select Date')
    expect(input).toHaveClass('text-current')
  })
})
