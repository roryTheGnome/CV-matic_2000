import { User } from '@/types/user'
import { ChevronRight, EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useAuthStore } from '@/store/authStore'
import { GlobalSortKey } from '@/types/table'
import defaultProfile from '../public/default-profile.png'
import { EmployeeActionsMenu } from './admin/EmployeeActionsMenu'

type EmployeesListProps = {
  users: User[] | []
  search: string
  sortKey: GlobalSortKey
  sortDir: 'asc' | 'desc'
  currentUserId: string | undefined
}

export default function EmployeesList({
  users,
  search,
  sortKey,
  sortDir,
  currentUserId,
}: EmployeesListProps) {
  const { isAdmin } = useAuthStore()

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

  return (
    <tbody>
      {checkedUsers.map((user) => (
        <tr key={user.id} className="divide-y divide-gray-500">
          <td className="flex items-center gap-3 px-4 py-3">
            <div className="relative h-10 w-10">
              <Image
                src={user.profile.avatar || defaultProfile}
                alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
                fill
                sizes="40px"
                className="rounded-full object-cover"
              />
            </div>

            {user.profile.first_name ? user.profile.first_name : 'Anonymous'}
          </td>

          <td className="px-4 py-3">{user.profile.last_name}</td>
          <td className="px-4 py-3">{user.email}</td>
          <td className="px-4 py-3">{user.department_name}</td>
          <td className="px-4 py-3">{user.position_name}</td>

          <td className="w-8 pr-2 text-right">
            {isAdmin ? (
              <EmployeeActionsMenu
                editType={'USER_EDIT'}
                deleteType={'USER_DELETE'}
                item={{
                  id: user.id,
                  name: `${user.profile.first_name} ${user.profile.last_name}`,
                }}
              />
            ) : (
              <Link
                href={`/users/${user.id}`}
                className="text-text-secondary hover:text-primary"
              >
                {currentUserId == Number(user.id) ? (
                  <EllipsisVertical size={30} />
                ) : (
                  <ChevronRight size={32} />
                )}
              </Link>
            )}
          </td>

          <td className="last:border-b last:border-gray-500"></td>
        </tr>
      ))}
    </tbody>
  )
}
