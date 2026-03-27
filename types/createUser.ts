import { LoginVariables } from "./auth"
import { Cvs } from "./cvs"
import { UserProfile, UserRole } from "./user"

export interface CreateProfileInput {
  first_name: string
  last_name: string
}

export interface CreateUserInput extends LoginVariables {
  profile: CreateProfileInput
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
