import LoadingPage from '@/app/(platform)/loading'
import CvNav from '@/components/navs/CvNav'
import { Suspense } from 'react'

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      <Suspense fallback={<LoadingPage />}>
        <CvNav />
        <div>{children}</div>
      </Suspense>
    </div>
  )
}
