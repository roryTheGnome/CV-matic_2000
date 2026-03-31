import { Language } from "@/types/lang"
import { Skill } from "@/types/skills"
import { LoginVariables } from "./auth"
import { Cvs } from "./cvs"
import { Department } from "./department"

export type UserRole = "Admin" | "Employee"

export type User = {
  id: string
  email: string
  password?: string
  is_verified: boolean
  profile: UserProfile
  cvs: Cvs
  department: Department
  department_name: string
  position: Position
  position_name: string
  role: UserRole
}

export type UserProfile = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  avatar?: string | null
  skills: Skill[]
  languages: Language[]
}

export type Position = {
  id: string
  name: string
}

export interface CreateUserModalFormState {
  email: string
  password: string
  firstName: string
  lastName: string
  departmentId: string
  departmentName?: string
  positionId: string
  positionName?: string
  role: UserRole
}

export interface CreateUserInput extends LoginVariables {
  profile: Partial<UserProfile>
  cvsIds: string[]
  departmentId: string
  positionId: string
  role: UserRole
}

export interface CreateUserVariables {
  user: CreateUserInput
}

export interface CreateUserData {
  createUser: {
    id: string
    created_at: string
    email: string
    is_verified: boolean
    department_name?: string | null
    position_name?: string | null
    role: string

    profile: UserProfile

    cvs?: Cvs
  }
}

export interface DeleteUserVariables {
  userId: string
}

export interface DeleteUserResponse {
  deleteUser: {
    affected: number
  }
}

export type GetUsersResponse = {
  users: User[]
}

export type GetUserResponse = {
  user: User
}

export interface UpdateUserVariables {
  user: {
    userId: string
    cvsIds?: string[]
    departmentId?: string | null
    positionId?: string | null
    role?: UserRole
  }
}

export interface UpdateUserData {
  updateUser: User
}

export interface GetUserByIdVariables {
  userId: string
}
export interface GetUserByIdData {
  user: {
    id: string
    created_at: string
    email: string
    is_verified: boolean
    role: UserRole
    department_name: string | null
    position_name: string | null

    profile: UserProfile
    department: Department | null
    position: Position | null
    cvs: Cvs[] | null
  }
}
