import { act, renderHook } from '@testing-library/react'

import { GlobalSortKey } from '@/types/table'
import { usePageWithTable } from '../usePageWithTable'

describe('usePageWithTable', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePageWithTable())

    expect(result.current.search).toBe('')
    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('asc')
  })

  it('should update search term when setSearch is called', () => {
    const { result } = renderHook(() => usePageWithTable())

    act(() => {
      result.current.setSearch('test string')
    })

    expect(result.current.search).toBe('test string')
  })

  it('should toggle sort direction when handleSort is called with the current sort key', () => {
    const { result } = renderHook(() => usePageWithTable())

    act(() => {
      result.current.handleSort('first_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('desc')

    act(() => {
      result.current.handleSort('first_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('asc')
  })

  it('should set new sort key and reset direction to asc when handleSort is called with a different key', () => {
    const { result } = renderHook(() => usePageWithTable())

    act(() => {
      result.current.handleSort('last_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('last_name')
    expect(result.current.sortDir).toBe('asc')

    act(() => {
      result.current.handleSort('department' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('department')
    expect(result.current.sortDir).toBe('asc')
  })
})
