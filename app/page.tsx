"use client"

import { DEPARTMENTS_QUERY } from "@/api/graphql/queries/auth"
import { LogoutButton } from "@/components/LogoutButton"
import { PUBLIC_ROUTES } from "@/config/routes"
import { useQuery } from "@apollo/client/react"
import Link from "next/link"

export default function Home() {
  const { data, loading, error } = useQuery(DEPARTMENTS_QUERY)

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
      <Link className="text-blue-500 underline" href={PUBLIC_ROUTES.LOGIN}>
        Login
      </Link>
      <LogoutButton />
    </div>
  )
}
