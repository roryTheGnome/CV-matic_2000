import { AdminNav } from "@/components/navs/AdminNav"
import "../globals.css"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-[200px_auto] min-h-screen">
      <nav className="">
        <AdminNav />
      </nav>

      <main>{children}</main>
    </div>
  )
}
