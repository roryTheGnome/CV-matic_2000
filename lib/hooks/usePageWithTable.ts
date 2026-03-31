import { GlobalSortKey } from "@/types/table"
import { useState } from "react"

export const usePageWithTable = () => {
  const [search, setSearch] = useState("")

  const [sortKey, setSortKey] = useState<GlobalSortKey>("first_name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (key: GlobalSortKey) => {
    if (key == sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  return {
    search,
    sortKey,
    sortDir,
    setSearch,
    handleSort,
  }
}
