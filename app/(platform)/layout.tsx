import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Nav from "@/components/navs/Nav";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Cv Platform",
}

export default function PlatformLayout({children,}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.className} h-full antialiased`}>
        <body className="min-h-screen flex">
        <div className="hidden md:block w-64 fixed left-0 top-0 h-screen">
            <Nav />
        </div>

        <main className="flex-1 md:ml-64 pb-20 md:pb-0">
            {children}
        </main>
        </body>
        </html>
    )
}