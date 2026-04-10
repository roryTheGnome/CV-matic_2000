import { TokenPayload } from '@/types/auth'
import { decodeJwt } from 'jose'
import { create } from 'zustand'

interface AuthStore {
  isAdmin: boolean
  currentUserId: string
  setFromToken: (token: string | undefined) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  isAdmin: false,
  currentUserId: '0',
  setFromToken: (token: string | undefined) => {
    if (!token) {
      set({ isAdmin: false })
      set({ currentUserId: '0' })
      return
    }
    try {
      const decodedUser = decodeJwt(token) as TokenPayload
      set({
        isAdmin: decodedUser.role === 'Admin',
        currentUserId: String(decodedUser.sub),
      })
    } catch (error) {
      console.error('Error while token parsing', error)
      set({ isAdmin: false, currentUserId: '0' })
    }
  },

  logout: () => set({ isAdmin: false }),
}))
