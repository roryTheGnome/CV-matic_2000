"use client"

import { removeAuthTokens } from "@/actions/auth"
import { PUBLIC_ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/authStore"
import { useApolloClient } from "@apollo/client/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function LogoutButton() {
  const router = useRouter()
  const client = useApolloClient()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await removeAuthTokens()

      await client.clearStore()
      logout()

      toast.success("Successfully logged out.", { duration: 2000 })

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
