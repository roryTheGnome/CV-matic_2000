"use client"

import { removeAuthTokens } from "@/actions/auth"
import { PUBLIC_ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/authStore"
import { useApolloClient } from "@apollo/client/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {LogOut} from "lucide-react";

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
      className="flex items-center gap-3 px-5 py-4 hover:bg-surface-active transition"
    >
      <LogOut size={20} className="w-5 h-5 text-text-primary" /><span>Logout</span>
    </button>
  )
}
