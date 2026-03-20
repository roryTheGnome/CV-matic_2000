import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Dashboard from "@/app/(platform)/(dashboard)/page";

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
        <nav className="w-1/6">
            <Dashboard />
        </nav>

        <main className="w-5/6">
            {children}
        </main>

        </body>
        </html>
    )
}