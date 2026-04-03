import { PRIVATE_ROUTES } from "@/config/routes"
import { usePathname } from "next/navigation"

export function useCvNav(id: string) {
  const pathname = usePathname()

  const tabs = [
    { label: "Details", path: `${PRIVATE_ROUTES.CVS}/${id}` },
    { label: "Skills", path: `${PRIVATE_ROUTES.CVS}/${id}/skills` },
    { label: "Projects", path: `${PRIVATE_ROUTES.CVS}/${id}/projects` },
    { label: "Preview", path: `${PRIVATE_ROUTES.CVS}/${id}/preview` },
  ]

  const isActive = (tabPath: string) => {
    if (pathname === tabPath) return true
    if (
      tabPath !== `${PRIVATE_ROUTES.CVS}/${id}` &&
      pathname.startsWith(tabPath + "/")
    )
      return true
    return false
  }

  return { tabs, isActive }
}
