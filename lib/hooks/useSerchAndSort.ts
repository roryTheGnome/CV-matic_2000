import { User } from '@/types/user'

export const useUsersSearchAndSort = (
  users: User[],
  search: string,
  sortKey: string,
  sortDir: 'asc' | 'desc',
) => {
  const checkedUsers = [...users]
    .filter((u: User) => {
      const fullname =
        `${u.profile.first_name} ${u.profile.last_name}`.toLowerCase()
      return fullname.includes(search.toLowerCase())
    })
    .sort((x: User, y: User) => {
      let valX = ''
      let valY = ''

      switch (sortKey) {
        case 'first_name':
          valY = y.profile.first_name
          valX = x.profile.first_name
          break
        case 'last_name':
          valY = y.profile.last_name
          valX = x.profile.last_name
          break
        case 'email':
          valY = y.email
          valX = x.email
          break
        case 'department':
          valY = y.department_name
          valX = x.department_name
          break
        case 'position':
          valY = y.position_name
          valX = x.position_name
          break
      }

      if (valX < valY) return sortDir === 'asc' ? -1 : 1
      if (valX > valY) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  return checkedUsers
}
