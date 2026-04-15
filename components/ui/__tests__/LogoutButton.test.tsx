import { removeAuthTokens } from '@/actions/auth'
import { useAuthStore } from '@/store/authStore'
import { useApolloClient } from '@apollo/client/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LogoutButton } from '../LogoutButton'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@apollo/client/react', () => ({
  useApolloClient: jest.fn(),
}))

jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../../../actions/auth', () => ({
  removeAuthTokens: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}))

jest.mock('lucide-react', () => ({
  LogOut: () => <div data-testid="logout-icon" />,
}))

const mockUseRouter = useRouter as jest.Mock
const mockUseApolloClient = useApolloClient as jest.Mock
const mockUseAuthStore = useAuthStore as unknown as jest.Mock
const mockRemoveAuthTokens = removeAuthTokens as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockToastSuccess = toast.success as jest.Mock

describe('LogoutButton', () => {
  const mockPush = jest.fn()
  const mockClearStore = jest.fn()
  const mockLogout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUseApolloClient.mockReturnValue({ clearStore: mockClearStore })
    mockUseAuthStore.mockReturnValue({ logout: mockLogout })
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders correctly with translation text', () => {
    render(<LogoutButton />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('logout')).toBeInTheDocument()
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('performs logout sequence successfully on click', async () => {
    mockRemoveAuthTokens.mockResolvedValueOnce(undefined)
    mockClearStore.mockResolvedValueOnce(undefined)

    render(<LogoutButton />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockRemoveAuthTokens).toHaveBeenCalledTimes(1)
    })

    expect(mockClearStore).toHaveBeenCalledTimes(1)
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockToastSuccess).toHaveBeenCalledWith('Successfully logged out.', {
      duration: 2000,
    })
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('logs error to console when logout fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockError = new Error('Network error')
    mockRemoveAuthTokens.mockRejectedValueOnce(mockError)

    render(<LogoutButton />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error while logout:', mockError)
    })

    expect(mockClearStore).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
