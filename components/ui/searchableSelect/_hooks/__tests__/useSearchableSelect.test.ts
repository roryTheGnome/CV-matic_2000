import { useModalStore } from '@/store/modalStore'
import { act, renderHook } from '@testing-library/react'
import type { MouseEvent } from 'react'
import { useSearchableSelect } from '../useSearchableSelect'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../../store/modalStore', () => ({
  useModalStore: jest.fn(),
}))

describe('useSearchableSelect', () => {
  const mockSetModalData = jest.fn()
  const mockOnChange = jest.fn()
  const options = [
    { value: 'p1', label: 'Project Alpha' },
    { value: 'p2', label: 'Project Beta' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      setModalData: mockSetModalData,
    })
  })

  it('should initialize with correct display value based on initial value', () => {
    const { result } = renderHook(() =>
      useSearchableSelect({
        options,
        name: 'project',
        value: 'p1',
        onChange: mockOnChange,
      }),
    )

    expect(result.current.displayValue).toBe('Project Alpha')
    expect(result.current.isOpen).toBe(false)
  })

  it('should reset state and call onChange when handleClear is called', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useSearchableSelect({
          options,
          name: 'project',
          value,
          onChange: mockOnChange,
        }),
      { initialProps: { value: 'p1' } },
    )

    const event = { stopPropagation: jest.fn() } as unknown as MouseEvent

    act(() => {
      result.current.handleClear(event)
    })

    rerender({ value: '' })

    expect(result.current.displayValue).toBe('')
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'project', value: '' },
    })
    expect(mockSetModalData).toHaveBeenCalledWith({ projectId: '' })
  })

  it('should close dropdown on outside click', () => {
    const { result } = renderHook(() =>
      useSearchableSelect({
        options,
        name: 'project',
        value: '',
        onChange: mockOnChange,
      }),
    )

    const mockContainer = document.createElement('div')
    document.body.appendChild(mockContainer)

    Object.defineProperty(result.current.wrapperRef, 'current', {
      value: mockContainer,
    })

    act(() => {
      result.current.setIsOpen(true)
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })

    expect(result.current.isOpen).toBe(false)

    document.body.removeChild(mockContainer)
  })

  it('should toggle dropdown state when handleToggleDropdown is called', () => {
    const { result } = renderHook(() =>
      useSearchableSelect({
        options,
        name: 'project',
        value: '',
        onChange: mockOnChange,
      }),
    )

    const event = { stopPropagation: jest.fn() } as unknown as MouseEvent

    act(() => {
      result.current.handleToggleDropdown(event)
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.handleToggleDropdown(event)
    })
    expect(result.current.isOpen).toBe(false)
  })
})
