import { decodeJwt } from 'jose'
import { useAuthStore } from '../authStore'

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}))

describe('useAuthStore', () => {
  const initialState = useAuthStore.getState()

  beforeEach(() => {
    useAuthStore.setState(initialState, true)
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(false)
    expect(state.currentUserId).toBe('0')
  })

  it('should reset state when token is undefined', () => {
    useAuthStore.setState({ isAdmin: true, currentUserId: '123' })

    useAuthStore.getState().setFromToken(undefined)

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(false)
    expect(state.currentUserId).toBe('0')
  })

  it('should set admin state and user id for a valid admin token', () => {
    ;(decodeJwt as jest.Mock).mockReturnValue({ role: 'Admin', sub: '99' })

    useAuthStore.getState().setFromToken('mock-admin-token')

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(true)
    expect(state.currentUserId).toBe('99')
  })

  it('should set non-admin state and user id for a valid non-admin token', () => {
    ;(decodeJwt as jest.Mock).mockReturnValue({ role: 'User', sub: '42' })

    useAuthStore.getState().setFromToken('mock-user-token')

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(false)
    expect(state.currentUserId).toBe('42')
  })

  it('should reset state and log error if token parsing fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(decodeJwt as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    useAuthStore.setState({ isAdmin: true, currentUserId: '123' })
    useAuthStore.getState().setFromToken('invalid-token')

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(false)
    expect(state.currentUserId).toBe('0')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error while token parsing',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })

  it('should reset admin state on logout', () => {
    useAuthStore.setState({ isAdmin: true, currentUserId: '123' })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(false)
    expect(state.currentUserId).toBe('123')
  })
})
