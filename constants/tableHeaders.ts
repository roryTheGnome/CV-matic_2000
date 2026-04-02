import {
  CvsHeader,
  Header,
  LanguageHeader,
  OnlyNameHeader,
  ProjectHeader,
  SkillHeader,
} from "@/types/table"

export const headers: Header[] = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Email", key: "email" },
  { label: "Department", key: "department" },
  { label: "Position", key: "position" },
]

export const skillsHeaders: SkillHeader[] = [
  { label: "Name", key: "skill_name" },
  { label: "Type", key: "skill_type" },
  { label: "Category", key: "skill_category" },
]

export const languageHeaders: LanguageHeader[] = [
  { label: "Name", key: "language_name" },
  { label: "Native Name", key: "language_native_name" },
  { label: "ISO2", key: "language_iso2" },
]

export const projectsHeaders: ProjectHeader[] = [
  { label: "Name", key: "project_name" },
  { label: "Domain", key: "project_domain" },
  { label: "Start Date", key: "project_start_date" },
  { label: "End Date", key: "project_end_date" },
]

export const cvsHeaders: CvsHeader[] = [
  { label: "Name", key: "cvs_name" },
  { label: "Education", key: "cvs_education" },
  { label: "Employee", key: "cvs_employee" },
]

export const onlyNameHeaders: OnlyNameHeader[] = [
  { label: "Name", key: "name" },
]
