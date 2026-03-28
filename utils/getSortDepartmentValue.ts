import { GlobalSortKey } from "@/types/table"

export const getSortByName = (
  item: { name: string },
  sortKey: GlobalSortKey,
) => {
  switch (sortKey) {
    case "first_name":
      return item.name
    default:
      return ""
  }
}
