import { User } from "@/types/user"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import defaultProfile from "../../../public/default-profile.png"

export function UserTableItem({ user }: { user: User }) {
  return (
    <tr key={user.id} className="divide-y divide-gray-500 ">
      <td className="px-4 py-3 flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src={user.profile.avatar || defaultProfile}
            alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
            fill
            sizes="40px"
            className="rounded-full object-cover"
          />
        </div>

        {user.profile.first_name ? user.profile.first_name : "Anonymous"}
      </td>

      <td className="px-4 py-3">{user.profile.last_name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{user.department_name}</td>
      <td className="px-4 py-3">{user.position_name}</td>

      <td className="w-8 text-right pr-2">
        <Link
          href={`/users/${user.id}`}
          className="text-text-secondary hover:text-primary"
        >
          <ChevronRight size={32} />
        </Link>
      </td>

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  )
}
