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
  { name: 'Employees', href: PRIVATE_ROUTES.USERS, icon: Users },
  { name: 'Skills', href: PRIVATE_ROUTES.SKILLS, icon: TrendingUp },
  { name: 'Languages', href: PRIVATE_ROUTES.LANGUAGES, icon: Languages },
  { name: 'CVs', href: PRIVATE_ROUTES.CVS, icon: FileText },
]

export const adminNavItems = [
  { name: 'Employees', href: PRIVATE_ROUTES.USERS, icon: Users },
  { name: 'Projects', href: ADMIN_ROUTES.PROJECTS, icon: Folders },
  { name: 'CVs', href: PRIVATE_ROUTES.CVS, icon: FileText },
  { name: 'Departments', href: ADMIN_ROUTES.DEPARTMENTS, icon: Building2 },
  { name: 'Positions', href: ADMIN_ROUTES.POSITIONS, icon: BriefcaseBusiness },
  { name: 'Skills', href: PRIVATE_ROUTES.SKILLS, icon: TrendingUp },
  { name: 'Languages', href: PRIVATE_ROUTES.LANGUAGES, icon: Languages },
]
