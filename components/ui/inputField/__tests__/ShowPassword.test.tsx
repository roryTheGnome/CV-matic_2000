import { fireEvent, render, screen } from '@testing-library/react'

import { ShowPassword } from '../ShowPassword'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />,
}))

describe('ShowPassword', () => {
  const mockSetCurrentType = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Eye icon and show aria-label when currentType is password', () => {
    render(
      <ShowPassword
        currentType="password"
        setCurrentType={mockSetCurrentType}
      />,
    )

    expect(screen.getByLabelText('show')).toBeInTheDocument()
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('eye-off-icon')).not.toBeInTheDocument()
  })

  it('renders EyeOff icon and hide aria-label when currentType is text', () => {
    render(
      <ShowPassword currentType="text" setCurrentType={mockSetCurrentType} />,
    )

    expect(screen.getByLabelText('hide')).toBeInTheDocument()
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('eye-icon')).not.toBeInTheDocument()
  })

  it('calls setCurrentType with text when currentType is password and button is clicked', () => {
    render(
      <ShowPassword
        currentType="password"
        setCurrentType={mockSetCurrentType}
      />,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetCurrentType).toHaveBeenCalledTimes(1)
    expect(mockSetCurrentType).toHaveBeenCalledWith('text')
  })

  it('calls setCurrentType with password when currentType is text and button is clicked', () => {
    render(
      <ShowPassword currentType="text" setCurrentType={mockSetCurrentType} />,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetCurrentType).toHaveBeenCalledTimes(1)
    expect(mockSetCurrentType).toHaveBeenCalledWith('password')
  })

  it('calls setCurrentType with password when currentType is undefined and button is clicked', () => {
    render(
      <ShowPassword
        currentType={undefined}
        setCurrentType={mockSetCurrentType}
      />,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetCurrentType).toHaveBeenCalledWith('password')
  })
})
