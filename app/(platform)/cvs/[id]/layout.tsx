import CvNav from "@/components/navs/CvNav"
import { Loader } from "@/components/ui/Loader"
import { Suspense } from "react"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function CvLayout({ children, params }: Props) {
  const { id } = await params

  return (
    <div className="p-6">
      <CvNav id={id} />
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  )
}
