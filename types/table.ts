export type GlobalSortKey =
  | SortKey
  | SkillSortKey
  | ProjectSortKey
  | CvsSortKey
  | DepartmentSortKey

export type GlobalHeader =
  | Header
  | SkillHeader
  | ProjectHeader
  | CvsHeader
  | DepartmentHeader

export type SortKey =
  | "first_name"
  | "last_name"
  | "email"
  | "department"
  | "position"

export type SkillSortKey = "skill_name" | "skill_type" | "skill_category"

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
