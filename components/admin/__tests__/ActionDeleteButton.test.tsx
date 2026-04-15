import { fireEvent, render, screen } from '@testing-library/react'

import { ActionDeleteButton } from '../_ui/ActionDeleteButton'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
}))

describe('ActionDeleteButton', () => {
  const mockHandleDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the delete button with correct translation', () => {
    render(<ActionDeleteButton handleDelete={mockHandleDelete} />)

    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('should call handleDelete when the button is clicked', () => {
    render(<ActionDeleteButton handleDelete={mockHandleDelete} />)

    const button = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(button)

    expect(mockHandleDelete).toHaveBeenCalledTimes(1)
  })
})
