"use client"

import { AdminActionsMenu } from "@/components/admin/AdminActionsMenu"
import { Button } from "@/components/ui/Button"
import SortHeader from "@/lib/SortHeader"
import { mockUsers } from "@/lib/mockUsers"
import { useAuthStore } from "@/store/authStore"
import { useModalStore } from "@/store/modalStore"
import { SortKey } from "@/types/sorting"
import { User } from "@/types/user"
import { ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function Employees() {
  const { isAdmin } = useAuthStore()
  const openModal = useModalStore(state => state.openModal)

  const [users] = useState<User[]>(mockUsers) //TODO change this to hook latr

  const [search, setSearch] = useState("")

  const [sortKey, setSortKey] = useState<SortKey>("first_name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (key: SortKey) => {
    if (key == sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const checkedUsers = useMemo(() => {
    return users
      .filter(u => {
        const fullname =
          `${u.profile.first_name} ${u.profile.last_name}`.toLowerCase()
        return fullname.includes(search.toLowerCase())
      })
      .sort((x, y) => {
        let valX = ""
        let valY = ""

        switch (sortKey) {
          case "first_name":
            valY = y.profile.first_name
            valX = x.profile.first_name
            break
          case "last_name":
            valY = y.profile.last_name
            valX = x.profile.last_name
            break
          case "email":
            valY = y.email
            valX = x.email
            break
          case "department":
            valY = y.department.name
            valX = x.department.name
            break
          case "position":
            valY = y.position.name
            valX = x.position.name
            break
        }

        if (valX < valY) return sortDir === "asc" ? -1 : 1
        if (valX > valY) return sortDir === "asc" ? 1 : -1
        return 0
      })
  }, [users, search, sortKey, sortDir])

  return (
    <div>
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search.."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-500 rounded-4xl w-full max-w-sm"
        />

        {isAdmin && (
          <Button
            Icon={Plus}
            isTextButton
            className="text-red-800"
            onClick={() => openModal("CREATE_USER")}
          >
            CREATE USER
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg ">
        <table className="min-w-full divide-y divide-gray-500 ">
          <thead>
            <tr>
              <SortHeader
                label="First Name"
                sortKeyValue="first_name"
                currentSortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Last Name"
                sortKeyValue="last_name"
                currentSortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Email"
                sortKeyValue="email"
                currentSortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Department"
                sortKeyValue="department"
                currentSortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Position"
                sortKeyValue="position"
                currentSortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <td className="w-8"></td>
            </tr>
          </thead>

          <tbody>
            {checkedUsers.map(user => (
              <tr key={user.id} className="divide-y divide-gray-500 ">
                <td className="px-4 py-3 flex items-center gap-3">
                  {user.profile.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <img
                      src={"https://placehold.co/40"}
                      alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  {user.profile.first_name}
                </td>

                <td className="px-4 py-3">{user.profile.last_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.department.name}</td>
                <td className="px-4 py-3">{user.position.name}</td>

                <td className="w-8 text-right pr-2">
                  {isAdmin ? (
                    <AdminActionsMenu userId={user.id} />
                  ) : (
                    <Link
                      href={`/users/${user.id}`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                    >
                      <ChevronRight size={32} />
                    </Link>
                  )}
                </td>

                <td className="last:border-b last:border-gray-500"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
