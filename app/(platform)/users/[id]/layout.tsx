import LoadingPage from "@/app/(platform)/users/[id]/loading"
import ProfileNav from "@/components/navs/ProfileNav"
import { Suspense } from "react"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-6">
      <Suspense fallback={<LoadingPage />}>
        <ProfileNav />
        <div>{children}</div>
      </Suspense>
    </div>
  )
}
