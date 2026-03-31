interface Props {
  search: string
  setSearch: (search: string) => void
}

export function TableSearch({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Search.."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="mb-4 px-4 py-2 border border-gray-500 rounded-4xl w-full max-w-sm"
    />
  )
}
