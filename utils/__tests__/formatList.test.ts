import { formatList } from '../formatList'

describe('formatList', () => {
  it('should return a comma-separated string when provided with multiple items', () => {
    const items = ['React', 'TypeScript', 'Tailwind']

    const result = formatList(items)

    expect(result).toBe('React, TypeScript, Tailwind')
  })

  it('should return the single item as a string when provided with one item', () => {
    const items = ['React']
    const result = formatList(items)
    expect(result).toBe('React')
  })

  it('should return "—" when provided with an empty array', () => {
    const items: string[] = []
    const result = formatList(items)
    expect(result).toBe('—')
  })

  it('should return "—" when no argument is provided (undefined)', () => {
    const result = formatList()
    expect(result).toBe('—')
  })
})
