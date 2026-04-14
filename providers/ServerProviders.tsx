import StoreInitializer from '@/components/StoreInitializer'
import { ACCESS_TOKEN } from '@/constants/auth'
import { ThemeProvider } from 'next-themes'
import { cookies } from 'next/headers'

export async function ServerProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  return (
    <>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <StoreInitializer token={token} />
        {children}
      </ThemeProvider>
    </>
  )
}
