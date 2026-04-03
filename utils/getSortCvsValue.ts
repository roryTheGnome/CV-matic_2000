import { Cvs } from '@/types/cvs'
import { GlobalSortKey } from '@/types/table'

export const getSortCvsValue = (cv: Cvs, sortKey: GlobalSortKey) => {
  switch (sortKey) {
    case 'cvs_name':
      return cv.name
    case 'cvs_education':
      return cv.education
    case 'cvs_employee':
      return cv.user.email
    default:
      return ''
  }
}
