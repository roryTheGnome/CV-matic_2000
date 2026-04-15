import { render } from '@testing-library/react'

const mockSetFromToken = jest.fn()

jest.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      setFromToken: mockSetFromToken,
    })),
  },
}))

describe('StoreInitializer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should initialize the store with the provided token only once', async () => {
    const StoreInitializer = (await import('../StoreInitializer')).default

    const { rerender, container } = render(
      <StoreInitializer token="test-token-123" />,
    )

    expect(mockSetFromToken).toHaveBeenCalledTimes(1)
    expect(mockSetFromToken).toHaveBeenCalledWith('test-token-123')
    expect(container).toBeEmptyDOMElement()

    rerender(<StoreInitializer token="new-token-456" />)

    expect(mockSetFromToken).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined token correctly', async () => {
    const StoreInitializer = (await import('../StoreInitializer')).default

    const { container } = render(<StoreInitializer token={undefined} />)

    expect(mockSetFromToken).toHaveBeenCalledTimes(1)
    expect(mockSetFromToken).toHaveBeenCalledWith(undefined)
    expect(container).toBeEmptyDOMElement()
  })
})
