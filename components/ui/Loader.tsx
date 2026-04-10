import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Loader({ title }: { title?: string }) {
  const t = useTranslations('Notifications')
  return (
    <div className="bg-background flex items-center justify-center">
      <div className="bg-surface flex flex-col items-center gap-4 rounded-2xl p-8 shadow-md">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />

        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold">
            {t('loadingText')}
          </p>
          <p className="text-text-secondary text-sm">{title}</p>
        </div>
      </div>
    </div>
  )
}
