import StoreInitializer from "@/components/StoreInitializer"
import { ACCESS_TOKEN } from "@/constants/auth"
import { cookies } from "next/headers"

export async function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  return (
    <>
      <StoreInitializer token={token} />
      {children}
    </>
  )
}
