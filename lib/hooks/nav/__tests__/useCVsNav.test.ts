import { useCv } from '@/lib/hooks/cvHooks/useCv'
import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { useCVsNav } from '../useCVsNav'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('../../cvHooks/useCv.ts', () => ({
  useCv: jest.fn(),
}))

describe('useCVsNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct navigation data when cv is loaded', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/cvs/123/details')
    ;(useCv as jest.Mock).mockReturnValue({
      cv: { name: 'Frontend Engineer' },
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCVsNav())

    expect(result.current.cv).toEqual({ name: 'Frontend Engineer' })
    expect(result.current.cvLoading).toBe(false)
    expect(result.current.cvError).toBeUndefined()
    expect(result.current.cvName).toBe('Frontend Engineer')
    expect(result.current.currentCvPiece).toBe('details')
  })

  it('should return unnamed cv and loading state when cv is fetching', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/cvs/123/skills')
    ;(useCv as jest.Mock).mockReturnValue({
      cv: undefined,
      isLoading: true,
      error: undefined,
    })

    const { result } = renderHook(() => useCVsNav())

    expect(result.current.cv).toBeUndefined()
    expect(result.current.cvLoading).toBe(true)
    expect(result.current.cvName).toBe('Unnamed CV')
    expect(result.current.currentCvPiece).toBe('skills')
  })

  it('should return error state when useCv fails', () => {
    const mockError = new Error('Failed to fetch')
    ;(usePathname as jest.Mock).mockReturnValue('/cvs/123/projects')
    ;(useCv as jest.Mock).mockReturnValue({
      cv: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useCVsNav())

    expect(result.current.cvError).toEqual(mockError)
  })

  it('should capitalize the first letter of a given string using formatCvLabel', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/cvs/123/details')
    ;(useCv as jest.Mock).mockReturnValue({
      cv: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCVsNav())

    expect(result.current.formatCvLabel('details')).toBe('Details')
    expect(result.current.formatCvLabel('skills')).toBe('Skills')
  })

  it('should handle undefined currentCvPiece when pathname is too short', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/cvs/123')
    ;(useCv as jest.Mock).mockReturnValue({
      cv: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCVsNav())

    expect(result.current.currentCvPiece).toBeUndefined()
  })
})
