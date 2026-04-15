import { renderHook } from '@testing-library/react'

import { useCv } from '@/lib/hooks/cvHooks/useCv'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useCvNav } from '../useCvNav'

jest.mock('../../../config/routes.ts', () => ({
  PRIVATE_ROUTES: {
    CVS: '/cvs',
  },
}))
jest.mock('../../../lib/hooks/cvHooks/useCv')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUseCv = useCv as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockUsePathname = usePathname as jest.Mock

interface MockCv {
  id: string
}

describe('useCvNav', () => {
  const mockCv: MockCv = { id: '123' }
  const mockError = new Error('Network Error')

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUsePathname.mockReturnValue('/cvs/123')
  })

  it('should return only error if cv is not present', () => {
    mockUseCv.mockReturnValue({
      cv: null,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useCvNav())

    expect(result.current).toEqual({ error: mockError })
    expect(result.current).not.toHaveProperty('tabs')
  })

  it('should return full state when cv is present', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCvNav())

    expect(result.current.cv).toEqual(mockCv)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.tabs).toBeDefined()
    expect(typeof result.current.isActive).toBe('function')
  })

  it('should generate correct tabs array', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCvNav())

    expect(result.current.tabs).toEqual([
      { label: 'details', path: '/cvs/123' },
      { label: 'skills', path: '/cvs/123/skills' },
      { label: 'projects', path: '/cvs/123/projects' },
      { label: 'preview', path: '/cvs/123/preview' },
    ])
  })

  it('should return true from isActive for exact path match', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })
    mockUsePathname.mockReturnValue('/cvs/123/skills')

    const { result } = renderHook(() => useCvNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/cvs/123/skills')).toBe(true)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return true from isActive for nested sub-path matches on non-base routes', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })
    mockUsePathname.mockReturnValue('/cvs/123/skills/new')

    const { result } = renderHook(() => useCvNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/cvs/123/skills')).toBe(true)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return false from isActive for nested sub-path matches on the base route', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })
    mockUsePathname.mockReturnValue('/cvs/123/skills')

    const { result } = renderHook(() => useCvNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/cvs/123')).toBe(false)
    } else {
      fail('isActive is not defined')
    }
  })

  it('should return false from isActive for non-matching paths', () => {
    mockUseCv.mockReturnValue({
      cv: mockCv,
      isLoading: false,
      error: undefined,
    })
    mockUsePathname.mockReturnValue('/cvs/123/preview')

    const { result } = renderHook(() => useCvNav())

    if ('isActive' in result.current && result.current.isActive) {
      expect(result.current.isActive('/cvs/123/projects')).toBe(false)
    } else {
      fail('isActive is not defined')
    }
  })
})
