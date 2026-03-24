import { PUBLIC_ROUTES } from "@/config/routes"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h2>HOME PAGE</h2>
      <Link className="text-blue-500 underline" href={PUBLIC_ROUTES.LOGIN}>
        Login
      </Link>
    </div>
  )
}
