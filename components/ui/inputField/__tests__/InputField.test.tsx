import { fireEvent, render, screen } from '@testing-library/react'
import { InputField } from '../InputField'

jest.mock('../ShowPassword', () => ({
  ShowPassword: ({
    currentType,
    setCurrentType,
  }: {
    currentType: string | undefined
    setCurrentType: (type: string) => void
  }) => (
    <button
      data-testid="show-password-toggle"
      onClick={() =>
        setCurrentType(currentType === 'password' ? 'text' : 'password')
      }
    >
      Toggle
    </button>
  ),
}))

describe('InputField', () => {
  it('renders correctly with required props', () => {
    render(
      <InputField
        inputId="test-id"
        label="Test Label"
        name="testName"
        type="text"
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Test Label' })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'test-id')
    expect(input).toHaveAttribute('name', 'testName')
    expect(input).toHaveAttribute('type', 'text')

    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('for', 'test-id')
  })

  it('does not render ShowPassword when type is not password', () => {
    render(
      <InputField
        inputId="test-id"
        label="Test Label"
        name="testName"
        type="email"
      />,
    )

    expect(screen.queryByTestId('show-password-toggle')).not.toBeInTheDocument()
  })

  it('applies custom className to the input element', () => {
    render(
      <InputField
        inputId="test-id"
        label="Test Label"
        name="testName"
        className="custom-class"
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Test Label' })
    expect(input).toHaveClass('custom-class')
  })

  it('passes additional props to the input element', () => {
    const handleChange = jest.fn()

    render(
      <InputField
        inputId="test-id"
        label="Test Label"
        name="testName"
        required
        disabled
        onChange={handleChange}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Test Label' })
    expect(input).toBeRequired()
    expect(input).toBeDisabled()

    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders ShowPassword component when type is password', () => {
    render(
      <InputField
        inputId="test-id"
        label="Password"
        name="password"
        type="password"
      />,
    )

    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveClass('pr-12')

    expect(screen.getByTestId('show-password-toggle')).toBeInTheDocument()
  })

  it('toggles input type between password and text using ShowPassword component', () => {
    render(
      <InputField
        inputId="test-id"
        label="Password"
        name="password"
        type="password"
      />,
    )

    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByTestId('show-password-toggle')

    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })
})
