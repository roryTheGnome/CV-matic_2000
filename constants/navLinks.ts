import { ADMIN_ROUTES, PRIVATE_ROUTES } from '@/config/routes'
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Folders,
  Languages,
  TrendingUp,
  Users,
} from 'lucide-react'

export const navItems = [
  { name: 'employees', href: PRIVATE_ROUTES.USERS, icon: Users },
  { name: 'skills', href: PRIVATE_ROUTES.SKILLS, icon: TrendingUp },
  { name: 'languages', href: PRIVATE_ROUTES.LANGUAGES, icon: Languages },
  { name: 'cvs', href: PRIVATE_ROUTES.CVS, icon: FileText },
]

export const adminNavItems = [
  { name: 'employees', href: PRIVATE_ROUTES.USERS, icon: Users },
  { name: 'projects', href: ADMIN_ROUTES.PROJECTS, icon: Folders },
  { name: 'cvs', href: PRIVATE_ROUTES.CVS, icon: FileText },
  { name: 'departments', href: ADMIN_ROUTES.DEPARTMENTS, icon: Building2 },
  { name: 'positions', href: ADMIN_ROUTES.POSITIONS, icon: BriefcaseBusiness },
  { name: 'skills', href: PRIVATE_ROUTES.SKILLS, icon: TrendingUp },
  { name: 'languages', href: PRIVATE_ROUTES.LANGUAGES, icon: Languages },
]
