import LoadingPage from "@/app/(platform)/loading"
import GlobalNav from "@/components/navs/GlobalNav"
import Nav from "@/components/navs/Nav"
import { Suspense } from "react"
import "../globals.css"

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <nav className="w-1/6 fixed left-0 top-0 h-screen">
        <Nav />
      </nav>

      <main className="ml-[16%] w-5/6 p-6 min-h-screen">
        <Suspense fallback={<LoadingPage />}>
          <GlobalNav />
          {children}
        </Suspense>
      </main>
    </>
  )
}
