import LoadingPage from '@/app/(platform)/loading'
import GlobalNav from '@/components/navs/GlobalNav'
import Nav from '@/components/navs/Nav'
import { Suspense } from 'react'
import '../globals.css'

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-1/6">
        <Nav />
      </div>

      <main className="ml-[16%] w-5/6 p-6">
        <Suspense fallback={<LoadingPage />}>
          <GlobalNav />
          {children}
        </Suspense>
      </main>
    </>
  )
}
