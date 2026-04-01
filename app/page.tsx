"use client"

import { GET_DEPARTMENTS } from "@/api/graphql/queries/departments"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/config/routes"
import { GetDepartmentsResponse } from "@/types/department"
import { useQuery } from "@apollo/client/react"
import Link from "next/link"

export default function Home() {
  const { data, loading, error } =
    useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS)

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error</div>
  }
  console.log(data)
  return (
    <div>
      <h2>HOME PAGE</h2>
      <div className="space-x-4">
        <Link className="text-blue-500 underline" href={PUBLIC_ROUTES.LOGIN}>
          Login
        </Link>
        <Link
          className="text-blue-500 underline"
          href={ADMIN_ROUTES.DEPARTMENTS}
        >
          Admin
        </Link>
        <LogoutButton />
      </div>
    </div>
  )
}
