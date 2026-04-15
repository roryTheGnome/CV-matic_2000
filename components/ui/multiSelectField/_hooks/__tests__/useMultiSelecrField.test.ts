import { useModalStore } from '@/store/modalStore'
import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { useMultiSelectField } from '../useMultiSelecrField'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../../store/modalStore')

const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('useMultiSelectField', () => {
  let mockOnChange: jest.Mock
  let mockOnFocus: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnChange = jest.fn()
    mockOnFocus = jest.fn()
    mockUseModalStore.mockReturnValue({ type: 'DEFAULT_TYPE' })
  })

  const getHookProps = (value: string) => ({
    value,
    name: 'testFieldName',
    onChange: mockOnChange,
    onFocus: mockOnFocus,
  })

  it('initializes with correctly parsed values', () => {
    const { result } = renderHook(() =>
      useMultiSelectField(getHookProps('Option 1, Option 2, Option 3')),
    )

    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedNames).toEqual([
      'Option 1',
      'Option 2',
      'Option 3',
    ])
    expect(result.current.isFilled).toBe(true)
    expect(result.current.disabled).toBe(false)
  })

  it('initializes correctly with an empty value', () => {
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))

    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedNames).toEqual([])
    expect(result.current.isFilled).toBe(false)
  })

  it('toggles menu state and calls onFocus when opening', () => {
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))

    act(() => {
      result.current.handleToggleMenu()
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.isFilled).toBe(true)
    expect(mockOnFocus).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.handleToggleMenu()
    })

    expect(result.current.isOpen).toBe(false)
    expect(mockOnFocus).toHaveBeenCalledTimes(1)
  })

  it('adds an option and calls onChange when toggling a new option', () => {
    const { result } = renderHook(() =>
      useMultiSelectField(getHookProps('Option 1')),
    )

    act(() => {
      result.current.toggleOption('Option 2')
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'testFieldName', value: 'Option 1, Option 2' },
    })
  })

  it('removes an option and calls onChange when toggling an existing option', () => {
    const { result } = renderHook(() =>
      useMultiSelectField(getHookProps('Option 1, Option 2')),
    )

    act(() => {
      result.current.toggleOption('Option 1')
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'testFieldName', value: 'Option 2' },
    })
  })

  it('removes a tag, stops propagation, and calls onChange', () => {
    const { result } = renderHook(() =>
      useMultiSelectField(getHookProps('Option 1, Option 2')),
    )
    const mockStopPropagation = jest.fn()
    const mockEvent = {
      stopPropagation: mockStopPropagation,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.removeTag(mockEvent, 'Option 2')
    })

    expect(mockStopPropagation).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'testFieldName', value: 'Option 1' },
    })
  })

  it('closes the menu when clicking outside of the container', () => {
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))
    const containerDiv = document.createElement('div')

    const mutableRef = result.current
      .containerRef as React.MutableRefObject<HTMLDivElement | null>
    mutableRef.current = containerDiv

    act(() => {
      result.current.handleToggleMenu()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true })
      document.dispatchEvent(outsideEvent)
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('does not close the menu when clicking inside the container', () => {
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))
    const containerDiv = document.createElement('div')

    const mutableRef = result.current
      .containerRef as React.MutableRefObject<HTMLDivElement | null>
    mutableRef.current = containerDiv

    act(() => {
      result.current.handleToggleMenu()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: containerDiv,
        enumerable: true,
      })
      containerDiv.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(true)
  })

  it('computes disabled flag correctly based on CV_PROJECT_EDIT modal store type', () => {
    mockUseModalStore.mockReturnValue({ type: 'CV_PROJECT_EDIT' })
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))
    expect(result.current.disabled).toBe(true)
  })

  it('computes disabled flag correctly based on CV_PROJECT_ADD modal store type', () => {
    mockUseModalStore.mockReturnValue({ type: 'CV_PROJECT_ADD' })
    const { result } = renderHook(() => useMultiSelectField(getHookProps('')))
    expect(result.current.disabled).toBe(true)
  })
})
