import StoreInitializer from '@/components/StoreInitializer'
import { ACCESS_TOKEN } from '@/constants/auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { cookies } from 'next/headers'

export async function ServerProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value
  const messages = await getMessages()
  const locale = await getLocale()
  return (
    <>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          <StoreInitializer token={token} />
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  )
}
