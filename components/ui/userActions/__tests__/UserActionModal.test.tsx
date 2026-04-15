import { PRIVATE_ROUTES } from '@/config/routes'
import { fireEvent, render, screen } from '@testing-library/react'
import { UserActionModal } from '../UserActionModal'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode
    href: string
    onClick: () => void
  }) {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
})

jest.mock('../../LogoutButton', () => ({
  LogoutButton: () => <button data-testid="logout-button">Logout</button>,
}))

jest.mock('lucide-react', () => ({
  CircleUserRound: () => <div data-testid="user-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
}))

describe('UserActionModal', () => {
  const mockOnClose = jest.fn()
  const userId = 'user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders profile and settings links with correct translations', () => {
    render(<UserActionModal userId={userId} onClose={mockOnClose} />)

    expect(screen.getByText('profile')).toBeInTheDocument()
    expect(screen.getByText('settings')).toBeInTheDocument()
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })

  it('renders profile link with correct href', () => {
    render(<UserActionModal userId={userId} onClose={mockOnClose} />)

    const profileLink = screen.getByRole('link', { name: /profile/i })
    expect(profileLink).toHaveAttribute(
      'href',
      `${PRIVATE_ROUTES.USERS}/${userId}`,
    )
  })

  it('calls onClose when profile link is clicked', () => {
    render(<UserActionModal userId={userId} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('profile'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when settings link is clicked', () => {
    render(<UserActionModal userId={userId} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('settings'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside the modal', () => {
    render(<UserActionModal userId={userId} onClose={mockOnClose} />)

    fireEvent.mouseDown(document.body)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking inside the modal', () => {
    const { container } = render(
      <UserActionModal userId={userId} onClose={mockOnClose} />,
    )

    const modalContent = container.firstChild as HTMLElement
    fireEvent.mouseDown(modalContent)

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener')
    const { unmount } = render(
      <UserActionModal userId={userId} onClose={mockOnClose} />,
    )

    unmount()
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    removeSpy.mockRestore()
  })
})
