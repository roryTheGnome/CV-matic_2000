export type GlobalSortKey =
  | SortKey
  | SkillSortKey
  | ProjectSortKey
  | CvsSortKey
  | OnlyNameSortKey
  | LanguageSortKey

export type GlobalHeader =
  | Header
  | SkillHeader
  | ProjectHeader
  | CvsHeader
  | OnlyNameHeader
  | LanguageHeader

export type SortKey =
  | "first_name"
  | "last_name"
  | "email"
  | "department"
  | "position"

export type SkillSortKey = "skill_name" | "skill_type" | "skill_category"

export type LanguageSortKey =
  | "language_name"
  | "language_native_name"
  | "language_iso2"

export type ProjectSortKey =
  | "project_name"
  | "project_domain"
  | "project_start_date"
  | "project_end_date"

export type CvsSortKey = "cvs_name" | "cvs_education" | "cvs_employee"

export type OnlyNameSortKey = "name"

export type Header = {
  label: string
  key: SortKey
}

export type SkillHeader = {
  label: string
  key: SkillSortKey
}

export type LanguageHeader = {
  label: string
  key: LanguageSortKey
}

export type ProjectHeader = {
  label: string
  key: ProjectSortKey
}

export type CvsHeader = {
  label: string
  key: CvsSortKey
}

export type OnlyNameHeader = {
  label: string
  key: OnlyNameSortKey
}
