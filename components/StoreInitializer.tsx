"use client"

import { useAuthStore } from "@/store/authStore"

let initialized = false

interface StoreInitializerProps {
  token: string | undefined
}

export default function StoreInitializer({ token }: StoreInitializerProps) {
  if (!initialized) {
    useAuthStore.getState().setUserFromToken(token)
    initialized = true
  }

  return null
}
