import { GlobalSortKey } from '@/types/table'
import { User } from '@/types/user'

export const getSortUserValue = (user: User, sortKey: GlobalSortKey) => {
  switch (sortKey) {
    case 'first_name':
      return user.profile.first_name
    case 'last_name':
      return user.profile.last_name
    case 'email':
      return user.email
    case 'department':
      return user.department_name
    case 'position':
      return user.position_name
    default:
      return ''
  }
}
