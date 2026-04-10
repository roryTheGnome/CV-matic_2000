import SortHeader from '@/components/SortHeader'
import { GlobalHeader, GlobalSortKey } from '@/types/table'
import { useTranslations } from 'next-intl'

interface Props {
  headers: GlobalHeader[]
  sortKey: GlobalSortKey
  sortDir: 'asc' | 'desc'
  handleSort: (key: GlobalSortKey) => void
}

export function TableHeader({ headers, sortKey, sortDir, handleSort }: Props) {
  const t = useTranslations('TableHeaders')

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <SortHeader
            key={header.key}
            label={t(header.label)}
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
