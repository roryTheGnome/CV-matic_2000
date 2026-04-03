import LoadingPage from "@/app/(platform)/users/[id]/loading"
import CvNav from "@/components/navs/CvNav"
import { Suspense } from "react"

interface Props {
  children: React.ReactNode
  params: { id: string }
}

export default function CvLayout({ children, params }: Props) {
  const cvId = params.id

  return (
    <div className="p-6">
      <Suspense fallback={<LoadingPage />}>
        <CvNav id={cvId} />
        <div>{children}</div>
      </Suspense>
    </div>
  )
}
