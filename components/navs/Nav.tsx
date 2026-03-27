"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {navItems} from "@/constants/navLinks";

export default function Nav() {
    const pathname = usePathname()

    return (
        <>
            <nav className="hidden md:flex h-full flex-col justify-between p-4 bg-surface">

                <div className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-full transition
                                    ${isActive
                                    ? `bg-surface-active`
                                    : `hover:bg-surface-active`
                                }`}
                            >
                                <Icon
                                    size={20}
                                    className= 'text-text-secondary'
                                />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                        U
                    </div>
                    <span>USER HERE</span>
                </div>
            </nav>

        </>
    )
} 