import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useAuthStore } from '@/store/authStore'
import { fireEvent, render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Nav from '../Nav'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} data-testid="next-image" alt={props.alt} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className: string
  }) => (
    <a href={href} className={className} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}))

jest.mock('../../../constants/navLinks', () => ({
  adminNavItems: [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: () => <div data-testid="AdminIcon" />,
    },
  ],
  navItems: [
    {
      name: 'User Dashboard',
      href: '/dashboard',
      icon: () => <div data-testid="UserIcon" />,
    },
  ],
}))

jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../../../lib/hooks/userHooks/useUser', () => ({
  useUser: jest.fn(),
}))

jest.mock('../../../components/ui/LogoutButton', () => ({
  LogoutButton: () => <button data-testid="LogoutButton">Logout</button>,
}))

jest.mock('../../ui/userActions/UserActionModal', () => ({
  UserActionModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="UserActionModal">
      <button onClick={onClose} data-testid="close-modal">
        Close
      </button>
    </div>
  ),
}))

jest.mock('lucide-react', () => ({
  ArrowLeftToLine: () => <div data-testid="ArrowLeftToLine" />,
  ArrowRightToLine: () => <div data-testid="ArrowRightToLine" />,
  CircleUserRound: () => <div data-testid="CircleUserRound" />,
  Settings: () => <div data-testid="Settings" />,
}))

const mockUsePathname = usePathname as jest.Mock
const mockUseAuthStore = useAuthStore as unknown as jest.Mock
const mockUseUser = useUser as jest.Mock

describe('Nav', () => {
  const mockSetCollapsed = jest.fn()

  const defaultUser = {
    id: 'user-123',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      avatar: null,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/dashboard')
    mockUseAuthStore.mockReturnValue({
      currentUserId: 'user-123',
      isAdmin: false,
    })
    mockUseUser.mockReturnValue({
      user: defaultUser,
    })
  })

  it('renders regular nav items when user is not an admin', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    expect(screen.getAllByText('User Dashboard').length).toBeGreaterThan(0)
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('UserIcon').length).toBeGreaterThan(0)
  })

  it('renders admin nav items when user is an admin', () => {
    mockUseAuthStore.mockReturnValue({
      currentUserId: 'user-123',
      isAdmin: true,
    })

    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    expect(screen.getAllByText('Admin Dashboard').length).toBeGreaterThan(0)
    expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('AdminIcon').length).toBeGreaterThan(0)
  })

  it('highlights the active link based on pathname', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const desktopLink = screen.getAllByTestId('link-/dashboard')[0]
    expect(desktopLink.className).toContain('bg-surface-active')
  })

  it('calls setCollapsed with true when collapse button is clicked', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const collapseButton = screen
      .getByTestId('ArrowLeftToLine')
      .closest('button')
    if (collapseButton) {
      fireEvent.click(collapseButton)
    }

    expect(mockSetCollapsed).toHaveBeenCalledWith(true)
  })

  it('calls setCollapsed with false when expand button is clicked', () => {
    render(<Nav collapsed={true} setCollapsed={mockSetCollapsed} />)

    const expandButton = screen
      .getByTestId('ArrowRightToLine')
      .closest('button')
    if (expandButton) {
      fireEvent.click(expandButton)
    }

    expect(mockSetCollapsed).toHaveBeenCalledWith(false)
  })

  it('displays user initial when avatar is not provided', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const initials = screen.getAllByText('J')
    expect(initials.length).toBeGreaterThan(0)
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
  })

  it('displays user avatar when provided', () => {
    mockUseUser.mockReturnValue({
      user: {
        ...defaultUser,
        profile: {
          ...defaultUser.profile,
          avatar: 'https://example.com/avatar.jpg',
        },
      },
    })

    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const images = screen.getAllByTestId('next-image')
    expect(images.length).toBeGreaterThan(0)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('toggles UserActionModal on desktop when profile button is clicked', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const desktopProfileButton = screen
      .getAllByText('John Doe')[0]
      .closest('button')

    expect(screen.queryByTestId('UserActionModal')).not.toBeInTheDocument()

    if (desktopProfileButton) {
      fireEvent.click(desktopProfileButton)
    }

    expect(screen.getByTestId('UserActionModal')).toBeInTheDocument()

    const closeButton = screen.getByTestId('close-modal')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('UserActionModal')).not.toBeInTheDocument()
  })

  it('toggles mobile menu on mobile profile button click', () => {
    render(<Nav collapsed={false} setCollapsed={mockSetCollapsed} />)

    const mobileProfileButton = screen
      .getAllByText('John Doe')[1]
      .closest('button')

    expect(screen.queryByTestId('CircleUserRound')).not.toBeInTheDocument()
    expect(screen.queryByTestId('LogoutButton')).not.toBeInTheDocument()

    if (mobileProfileButton) {
      fireEvent.click(mobileProfileButton)
    }

    expect(screen.getByTestId('CircleUserRound')).toBeInTheDocument()
    expect(screen.getByTestId('LogoutButton')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('hides text in links when collapsed is true', () => {
    render(<Nav collapsed={true} setCollapsed={mockSetCollapsed} />)

    const desktopNavContainer = screen.getAllByRole('navigation')[0]
    expect(desktopNavContainer).not.toHaveTextContent('User Dashboard')
  })
})
