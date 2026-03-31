import { Project } from "next/dist/build/swc/types"
import { Language } from "./lang"
import { Skill } from "./skills"
import { User, UserRole } from "./user"

export interface Cvs {
  id: string
  created_at: string
  name: string
  education: string
  description: string
  user: User
  projects: CvProject
  skills: Skill
  languages: Language
}

export interface CvProject {
  id: string
  project: Project
  name: string
  internal_name: string
  description: string
  domain: string
  start_date: string
  end_date: string
  environment: string
  roles: UserRole
  responsibilities: string
}

export interface GetCvsData {
  cvs: Cvs[]
}
