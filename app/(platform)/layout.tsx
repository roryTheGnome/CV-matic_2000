import Nav from '@/components/navs/Nav'
import '../globals.css'
import GlobalNav from '@/components/navs/GlobalNav'
import LoadingPage from '@/app/(platform)/loading'
import { Suspense } from 'react'

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <nav className="fixed top-0 left-0 h-screen w-1/6">
        <Nav />
      </nav>

      <main className="sm:ml-[16%] sm:w-5/6 sm:p-6">
        <Suspense fallback={<LoadingPage />}>
          <GlobalNav />
          {children}
        </Suspense>
      </main>
    </>
  )
}
