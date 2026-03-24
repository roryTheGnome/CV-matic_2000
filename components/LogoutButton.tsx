"use client"

import { removeAuthTokens } from "@/actions/auth"
import { PUBLIC_ROUTES } from "@/config/routes"
import { useApolloClient } from "@apollo/client/react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()
  const client = useApolloClient()

  const handleLogout = async () => {
    try {
      await removeAuthTokens()

      await client.clearStore()

      router.push(PUBLIC_ROUTES.LOGIN)
    } catch (error) {
      console.error("Error while logout:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Logout
    </button>
  )
}
