"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  href: string
  name: "Log in" | "Sign up"
}

export function AuthTab({ href, name }: Props) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={`uppercase border-b-2 border-background p-4 w-full max-w-32 text-center ${href === pathname && "active-tab border-primary text-primary"}`}
    >
      {name}
    </Link>
  )
}
