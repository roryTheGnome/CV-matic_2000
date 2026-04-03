"use client"

import LoadingPage from "@/app/(platform)/users/[id]/loading"
import EditableProfile from "@/components/Profile/EditableProfile"
import Profile from "@/components/Profile/Profile"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import NotFoundPage from "@/app/(platform)/not-found";

export default function Employee() {
  const { user, isLoading, error } = useUser()

  const { currentUserId } = useCurrentUser()

  if (error) return <NotFoundPage />

  if (isLoading || !user || currentUserId === undefined) {
    return <LoadingPage />
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {currentUserId === Number(user.id) ? (
        <EditableProfile user={user} />
      ) : (
        <Profile user={user} />
      )}
    </div>
  )
}
