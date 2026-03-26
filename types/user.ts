import { Language } from "@/types/lang"
import { Skill } from "@/types/skills"

export type UserRole = "Admin" | "Emploee"

export type User = {
  id: string
  email: string
  department: string
  position: string
  profile: {
    created_at: string
    first_name: string
    last_name: string
    avatar?: string | null
    skills: Skill[]
    languages: Language[]
  }
}
