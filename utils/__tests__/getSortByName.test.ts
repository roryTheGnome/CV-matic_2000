import { GlobalSortKey } from '@/types/table'
import { getSortByName } from '../getSortByName'

describe('getSortByName', () => {
  const mockItem = { name: 'Alice' }

  it('should return the item name when sortKey is "name"', () => {
    expect(getSortByName(mockItem, 'name' as GlobalSortKey)).toBe('Alice')
  })

  it('should return an empty string when sortKey is not "name"', () => {
    expect(getSortByName(mockItem, 'date' as GlobalSortKey)).toBe('')
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortByName(mockItem, 'invalid_key' as unknown as GlobalSortKey),
    ).toBe('')
  })

  it('should return an empty string if the item name is an empty string and sortKey is "name"', () => {
    const emptyNameItem = { name: '' }
    expect(getSortByName(emptyNameItem, 'name' as GlobalSortKey)).toBe('')
  })
})
