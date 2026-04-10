'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  href: string
  name: string
}

export function AuthTab({ href, name }: Props) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={`border-background w-full max-w-32 border-b-2 p-4 text-center uppercase ${href === pathname && 'active-tab border-primary text-primary'}`}
    >
      {name}
    </Link>
  )
}
