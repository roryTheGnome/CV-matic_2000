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

export interface CreateCvModalFormState {
  name: string
  education: string
  description: string
  user: User | null
}

export interface CreateCvVariables {
  cv: {
    name: string
    education?: string | null
    description: string
    userId?: string | null
    user: User | null
  }
}

export interface UpdateCvVariables {
  cv: {
    cvId: string
    name: string
    education?: string | null
    description: string
  }
}

export interface CreateCvData {
  createCv: Cvs
}

export interface UpdateCvData {
  updateCv: Cvs
}

export interface GetCvsData {
  cvs: Cvs[]
}

export interface GetCvByIdVariables {
  cvId: string
}

export interface GetCvByIdData {
  cv: {
    id: string
    created_at: string
    name: string
    education: string | null
    description: string

    user: User | null
    projects: Project[] | null
    skills: Skill[]
    languages: Language[]
  }
}
