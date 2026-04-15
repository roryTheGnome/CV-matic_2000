import { act, renderHook } from '@testing-library/react'
import { ChangeEvent, KeyboardEvent } from 'react'
import { useTagInputField } from '../useTagInputField'

describe('useTagInputField', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correctly parsed selectedNames', () => {
    const { result } = renderHook(() =>
      useTagInputField({
        value: 'tag1, tag2',
        name: 'tags',
        onChange: mockOnChange,
      }),
    )

    expect(result.current.selectedNames).toEqual(['tag1', 'tag2'])
    expect(result.current.inputValue).toBe('')
    expect(result.current.isFilled).toBe(true)
  })

  it('should initialize with empty selectedNames if value is empty', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: '', name: 'tags', onChange: mockOnChange }),
    )

    expect(result.current.selectedNames).toEqual([])
    expect(result.current.isFilled).toBe(false)
  })

  it('should update inputValue on handleInputChange', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: '', name: 'tags', onChange: mockOnChange }),
    )

    act(() => {
      result.current.handleInputChange({
        target: { value: 'new tag' },
      } as ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.inputValue).toBe('new tag')
    expect(result.current.isFilled).toBe(true)
  })

  it('should add a tag when Enter is pressed', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: 'tag1', name: 'tags', onChange: mockOnChange }),
    )

    act(() => {
      result.current.handleInputChange({
        target: { value: 'tag2' },
      } as ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>)
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'tags', value: 'tag1, tag2' },
    })
    expect(result.current.inputValue).toBe('')
  })

  it('should add a tag when comma is pressed', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: 'tag1', name: 'tags', onChange: mockOnChange }),
    )

    act(() => {
      result.current.handleInputChange({
        target: { value: 'tag2' },
      } as ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleKeyDown({
        key: ',',
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>)
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'tags', value: 'tag1, tag2' },
    })
  })

  it('should not add duplicate tags', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: 'tag1', name: 'tags', onChange: mockOnChange }),
    )

    act(() => {
      result.current.handleInputChange({
        target: { value: 'tag1' },
      } as ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>)
    })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(result.current.inputValue).toBe('')
  })

  it('should remove the last tag on Backspace if input is empty', () => {
    const { result } = renderHook(() =>
      useTagInputField({
        value: 'tag1, tag2',
        name: 'tags',
        onChange: mockOnChange,
      }),
    )

    act(() => {
      result.current.handleKeyDown({
        key: 'Backspace',
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>)
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'tags', value: 'tag1' },
    })
  })

  it('should remove a specific tag via removeTag', () => {
    const { result } = renderHook(() =>
      useTagInputField({
        value: 'tag1, tag2',
        name: 'tags',
        onChange: mockOnChange,
      }),
    )

    act(() => {
      result.current.removeTag('tag1')
    })

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'tags', value: 'tag2' },
    })
  })

  it('should correctly set isFilled based on focus', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: '', name: 'tags', onChange: mockOnChange }),
    )

    expect(result.current.isFilled).toBe(false)

    act(() => {
      result.current.setIsFocused(true)
    })

    expect(result.current.isFilled).toBe(true)
  })

  it('should call focus on input element via focusInput', () => {
    const { result } = renderHook(() =>
      useTagInputField({ value: '', name: 'tags', onChange: mockOnChange }),
    )

    const mockFocus = jest.fn()
    Object.defineProperty(result.current.inputRef, 'current', {
      value: { focus: mockFocus },
    })

    act(() => {
      result.current.focusInput()
    })

    expect(mockFocus).toHaveBeenCalled()
  })
})
