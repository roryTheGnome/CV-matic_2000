export function formatList(items?: string[]) {
  if (!items || items.length === 0) return '—'
  return items.join(', ')
}
