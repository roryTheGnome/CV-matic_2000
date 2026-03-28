import Nav from "@/components/navs/Nav"
import "../globals.css"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-[200px_auto] min-h-screen">
      <Nav />

      <main>{children}</main>
    </div>
  )
}
