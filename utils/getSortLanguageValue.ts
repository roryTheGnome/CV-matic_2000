import { LanguageItem } from "@/types/languages"
import { GlobalSortKey } from "@/types/table"

export const getSortLanguageValue = (
  language: LanguageItem,
  sortKey: GlobalSortKey,
) => {
  switch (sortKey) {
    case "language_name":
      return language.name
    case "language_native_name":
      return language.native_name
    case "language_iso2":
      return language.iso2
    default:
      return ""
  }
}
