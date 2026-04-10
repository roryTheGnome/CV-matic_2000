import { LogoutButton } from '@/components/ui/LogoutButton'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/config/routes'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h2>HOME PAGE</h2>
      <div className="space-x-4">
        <Link className="text-blue-500 underline" href={PUBLIC_ROUTES.LOGIN}>
          Login
        </Link>
        <Link className="text-blue-500 underline" href={PRIVATE_ROUTES.USERS}>
          Users
        </Link>
        <LogoutButton />
      </div>
    </div>
  )
}
