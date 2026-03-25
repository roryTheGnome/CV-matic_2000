import Link from "next/link"

interface Props {
  href: string
  text: string
}

export function AuthLink({ href, text }: Props) {
  return (
    <Link
      className="text-text-secondary uppercase font-semibold hover:brightness-150 duration-300"
      href={href}
    >
      {text}
    </Link>
  )
}
