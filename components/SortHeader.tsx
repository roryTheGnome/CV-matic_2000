import { GlobalSortKey } from '@/types/table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export default function SortHeader({
  label,
  sortKeyValue,
  currentSortKey,
  sortDir,
  onSort,
}: {
  label: string
  sortKeyValue: GlobalSortKey
  currentSortKey: GlobalSortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: GlobalSortKey) => void
}) {
  const isActive = currentSortKey === sortKeyValue

  return (
    <th
      onClick={() => onSort(sortKeyValue)}
      className="cursor-pointer px-4 py-2 text-left select-none"
    >
      <div className="flex items-center gap-1">
        {label}

        {isActive ? (
          sortDir === 'asc' ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )
        ) : (
          <ArrowUpDown size={16} className="opacity-40" />
        )}
      </div>
    </th>
  )
}
