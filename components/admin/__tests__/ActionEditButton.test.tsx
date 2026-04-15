import { fireEvent, render, screen } from '@testing-library/react'
import { ActionEditButton } from '../_ui/ActionEditButton'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  Pencil: () => <svg data-testid="pencil-icon" />,
}))

describe('ActionEditButton', () => {
  const mockHandleEdit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the edit button with correct translation', () => {
    render(<ActionEditButton handleEdit={mockHandleEdit} />)

    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument()
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
  })

  it('should call handleEdit when the button is clicked', () => {
    render(<ActionEditButton handleEdit={mockHandleEdit} />)

    const button = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(button)

    expect(mockHandleEdit).toHaveBeenCalledTimes(1)
  })
})
