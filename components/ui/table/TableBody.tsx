import { ReactNode } from "react"

interface Props<T> {
  arrayOfItems: T[]
  search: string
  sortKey: string
  sortDir: "asc" | "desc"
  getSearchText: (item: T) => string
  getSortValue: (item: T, sortKey: string) => string | number | boolean
  renderRow: (item: T, index: number) => ReactNode
}

export default function TableBody<T>({
  arrayOfItems,
  search,
  sortKey,
  sortDir,
  getSearchText,
  getSortValue,
  renderRow,
}: Props<T>) {
  const processedItems = [...arrayOfItems]
    .filter((item) => {
      const textToSearch = getSearchText(item).toLowerCase()
      return textToSearch.includes(search.toLowerCase())
    })
    .sort((x, y) => {
      const valX = getSortValue(x, sortKey)
      const valY = getSortValue(y, sortKey)

      if (valX < valY) return sortDir === "asc" ? -1 : 1
      if (valX > valY) return sortDir === "asc" ? 1 : -1
      return 0
    })

  return (
    <tbody>
      {processedItems.map((item, index) => renderRow(item, index))}
    </tbody>
  )
}