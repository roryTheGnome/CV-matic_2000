'use client'

import LoadingPage from '@/app/(platform)/users/[id]/loading'
import EditableProfile from '@/components/profile/EditableProfile'
import Profile from '@/components/profile/Profile'
import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import NotFoundPage from '@/app/(platform)/not-found'

export default function Employee() {
  const { user, isLoading, error } = useUser()

  const { currentUserId, currentUserRole } = useCurrentUser()

  if (error) return <NotFoundPage />

  if (isLoading || !user || currentUserId === undefined) {
    return <LoadingPage />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:p-6">
      {currentUserId === Number(user.id) || currentUserRole === 'Admin' ? (
        <EditableProfile user={user} />
      ) : (
        <Profile user={user} />
      )}
    </div>
  )
}
