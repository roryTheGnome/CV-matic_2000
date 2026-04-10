import {
  CvsHeader,
  Header,
  LanguageHeader,
  OnlyNameHeader,
  ProjectHeader,
  SkillHeader,
} from '@/types/table'

export const headers: Header[] = [
  { label: 'firstName', key: 'first_name' },
  { label: 'lastName', key: 'last_name' },
  { label: 'email', key: 'email' },
  { label: 'department', key: 'department' },
  { label: 'position', key: 'position' },
]

export const skillsHeaders: SkillHeader[] = [
  { label: 'name', key: 'skill_name' },
  { label: 'type', key: 'skill_type' },
  { label: 'category', key: 'skill_category' },
]

export const languageHeaders: LanguageHeader[] = [
  { label: 'name', key: 'language_name' },
  { label: 'nativeName', key: 'language_native_name' },
  { label: 'iso2', key: 'language_iso2' },
]

export const projectsHeaders: ProjectHeader[] = [
  { label: 'name', key: 'project_name' },
  { label: 'domain', key: 'project_domain' },
  { label: 'startDate', key: 'project_start_date' },
  { label: 'endDate', key: 'project_end_date' },
]

export const cvsHeaders: CvsHeader[] = [
  { label: 'name', key: 'cvs_name' },
  { label: 'education', key: 'cvs_education' },
  { label: 'employee', key: 'cvs_employee' },
]

export const onlyNameHeaders: OnlyNameHeader[] = [
  { label: 'name', key: 'name' },
]
