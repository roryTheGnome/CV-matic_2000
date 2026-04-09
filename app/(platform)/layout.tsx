'use client'
import LoadingPage from '@/app/(platform)/loading'
import GlobalNav from '@/components/navs/GlobalNav'
import Nav from '@/components/navs/Nav'
import { Suspense, useState } from 'react'
import '../globals.css'

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <nav
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-1/6'}`}
      >
        <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
      </nav>

      <main
        className={`p-6 pb-24 transition-all duration-300 lg:pb-6 ${collapsed ? 'lg:ml-20 lg:w-[calc(100%-80px)]' : 'lg:ml-[16%] lg:w-5/6'} `}
      >
        <Suspense fallback={<LoadingPage />}>
          <GlobalNav />
          {children}
        </Suspense>
      </main>
    </>
  )
}
