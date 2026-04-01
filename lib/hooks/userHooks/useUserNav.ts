import { useUser } from "@/lib/hooks/userHooks/useUser"
import { usePathname } from "next/navigation"

export function useUserNav() {
  const pathname = usePathname()
  const { user, isLoading, error } = useUser()

  const pieces = pathname.split("/").filter(Boolean)
  const currentPiece = pieces[2]

  const formatLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1)

  const displayName = user
    ? `${user.profile.first_name} ${user.profile.last_name}`
    : "Unnamed User"

  return {
    user,
    isLoading,
    error,
    displayName,
    currentPiece,
    formatLabel,
  }
}
