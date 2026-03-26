import { TokenPayload } from "@/types/auth"
import { decodeJwt } from "jose"
import { create } from "zustand"

interface AuthStore {
  user: TokenPayload | null
  setUserFromToken: (token: string | undefined) => void
}

export const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  setUserFromToken: (token: string | undefined) => {
    if (!token) {
      set({ user: null })
      return
    }
    try {
      const decodedUser = decodeJwt(token) as TokenPayload
      set({ user: decodedUser })
    } catch (error) {
      console.error("Error while token parsing", error)
      set({ user: null })
    }
  },
}))
