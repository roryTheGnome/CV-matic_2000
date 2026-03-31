import { GlobalSortKey } from "@/types/table"

export const getSortByName = (
  item: { name: string },
  sortKey: GlobalSortKey,
) => {
  switch (sortKey) {
    case "name":
      return item.name
    default:
      return ""
  }
}
