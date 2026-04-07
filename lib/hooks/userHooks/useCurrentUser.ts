'use client'
import { useEffect, useState } from 'react'
import { getAccessToken } from '@/actions/auth'
import { getCurrentUser } from '@/lib/GetCurrent'

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  )
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    async function fetchToken() {
      const token = await getAccessToken()
      if (token) {
        const currentUser = getCurrentUser(token)
        const id = currentUser?.sub
        const role = currentUser?.role
        setCurrentUserRole(role)
        setCurrentUserId(id)
      }
    }
    fetchToken()
  }, [])

  return {
    currentUserId,
    currentUserRole,
  }
}
