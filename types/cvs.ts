import { Project } from 'next/dist/build/swc/types'
import { Language, LanguageProficiency } from './lang'
import { Skill, SkillMastery } from './skills'
import { User, UserRole } from './user'

export interface Cvs {
  id: string
  created_at: string
  name: string
  education: string
  description: string
  user: User
  projects: CvProject[]
  skills: SkillMastery[]
  languages: LanguageProficiency[]
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
  environment: string[]
  roles: UserRole[]
  responsibilities: string[]
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
  cv: Cvs
}

export interface DeleteCvVariables {
  cv: {
    cvId: string
  }
}

export interface DeleteCvResponse {
  deleteCv: {
    affected: number
  }
}
