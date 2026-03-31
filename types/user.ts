import { Language } from "@/types/lang"
import { Skill } from "@/types/skills"
import { Cvs } from "./cvs"
import { Department } from "./department"

export type UserRole = "Admin" | "Employee"

export type User = {
  id: string
  email: string
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

export interface ModalFormState {
  email: string
  password: string
  firstName: string
  lastName: string
  departmentId: string
  positionId: string
  role: UserRole
}

export interface DeleteUserVariables {
  userId: string
}

export interface DeleteUserResponse {
  deleteUser: {
    affected: number
  }
}
export type GetUserResponse = {
  user: User;
};
export type GetUsersResponse = {
  users: User[];
};