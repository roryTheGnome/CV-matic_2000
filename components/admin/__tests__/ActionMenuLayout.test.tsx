import { fireEvent, render, screen } from '@testing-library/react'

import React from 'react'
import { ActionMenuLayout } from '../ActionMenuLayout'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('lucide-react', () => ({
  MoreVertical: () => <svg data-testid="more-vertical-icon" />,
}))

describe('ActionMenuLayout', () => {
  const mockSetIsOpen = jest.fn()
  const menuRef = React.createRef<HTMLDivElement>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ActionMenuLayout menuRef={menuRef} setIsOpen={mockSetIsOpen}>
        <div data-testid="child-element">Action Item</div>
      </ActionMenuLayout>,
    )

    expect(screen.getByTestId('child-element')).toBeInTheDocument()
    expect(screen.getByText('Action Item')).toBeInTheDocument()
  })

  it('should render the button with the correct aria-label and icon', () => {
    render(
      <ActionMenuLayout menuRef={menuRef} setIsOpen={mockSetIsOpen}>
        <div>Child</div>
      </ActionMenuLayout>,
    )

    const button = screen.getByRole('button', { name: 'openActionsAria' })
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument()
  })

  it('should call setIsOpen when the button is clicked', () => {
    render(
      <ActionMenuLayout menuRef={menuRef} setIsOpen={mockSetIsOpen}>
        <div>Child</div>
      </ActionMenuLayout>,
    )

    const button = screen.getByRole('button', { name: 'openActionsAria' })
    fireEvent.click(button)

    expect(mockSetIsOpen).toHaveBeenCalledTimes(1)
  })

  it('should attach the ref to the root div element', () => {
    const { container } = render(
      <ActionMenuLayout menuRef={menuRef} setIsOpen={mockSetIsOpen}>
        <div>Child</div>
      </ActionMenuLayout>,
    )

    expect(menuRef.current).toBe(container.firstChild)
    expect(menuRef.current?.nodeName).toBe('DIV')
  })
})
