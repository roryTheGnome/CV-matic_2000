import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage')

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="bg-surface flex w-full max-w-md flex-col items-center gap-6 rounded-2xl p-10 text-center shadow-md">
        <div className="bg-surface-active flex h-16 w-16 items-center justify-center rounded-full">
          <AlertCircle className="text-primary h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-text-primary text-3xl font-bold">404</h1>
          <p className="text-text-primary text-lg font-medium">
            {t('pageNotFound')}
          </p>
          <p className="text-text-secondary text-sm">{t('errorText')}</p>
        </div>

        <Link
          href="/users"
          className="bg-primary mt-2 rounded-full px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          {t('backLink')}
        </Link>
      </div>
    </div>
  )
}
