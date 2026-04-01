import SortHeader from "@/components/SortHeader"
import { GlobalHeader, GlobalSortKey } from "@/types/table"

interface Props {
  headers: GlobalHeader[]
  sortKey: GlobalSortKey
  sortDir: "asc" | "desc"
  handleSort: (key: GlobalSortKey) => void
}

export function TableHeader({ headers, sortKey, sortDir, handleSort }: Props) {
  return (
    <thead>
      <tr>
        {headers.map(header => (
          <SortHeader
            key={header.key}
            label={header.label}
            sortKeyValue={header.key}
            currentSortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
        ))}
      </tr>
    </thead>
  )
}
