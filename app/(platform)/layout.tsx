import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Nav from "@/components/Nav";

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
        <nav className="w-1/6 fixed left-0 top-0 h-screen">
            <Nav />
        </nav>

        <main className="ml-[16%] w-5/6">
            {children}
        </main>

        </body>
        </html>
    )
}