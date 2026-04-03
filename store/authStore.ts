import { TokenPayload } from '@/types/auth'
import { decodeJwt } from 'jose'
import { create } from 'zustand'

interface AuthStore {
  isAdmin: boolean
  setIsAdminFromToken: (token: string | undefined) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  isAdmin: false,
  setIsAdminFromToken: (token: string | undefined) => {
    if (!token) {
      set({ isAdmin: false })
      return
    }
    try {
      const decodedUser = decodeJwt(token) as TokenPayload
      set({ isAdmin: decodedUser.role === 'Admin' })
    } catch (error) {
      console.error('Error while token parsing', error)
      set({ isAdmin: false })
    }
  },
  logout: () => set({ isAdmin: false }),
}))
