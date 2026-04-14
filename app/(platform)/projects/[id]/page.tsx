'use client'

import { useProject } from '@/lib/hooks/projectHooks/useProject'
import { ActionsMenu } from '@/components/admin/ActionsMenu'
import { useAuthStore } from '@/store/authStore'
import { useTranslations } from 'next-intl'
import { Loader } from '@/components/ui/Loader'

export default function ProjectDetails() {
  const { isLoading, error, project } = useProject()
  const { isAdmin } = useAuthStore()
  const t = useTranslations('ProjectDetails')
  const n = useTranslations('Notifications')

  if (isLoading) {
    return <Loader />
  }
  if (error) {
    return <div className="p-4 text-red-500">{n('errorOccurred')}</div>
  }
  if (!project) {
    return null
  }

  const { id, name, domain, start_date, end_date, description, environment } =
    project

  return (
    <div>
      <div>
        <div className="border-border flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-foreground text-xl font-semibold">{name}</h2>
            <p className="text-muted-foreground text-sm">{domain}</p>
          </div>

          {isAdmin && (
            <ActionsMenu
              editType="PROJECT_EDIT"
              deleteType="PROJECT_DELETE"
              item={{ id, name }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t('startDate')}</p>
            <p className="font-medium">{start_date}</p>
          </div>

          <div>
            <p className="text-muted-foreground">{t('endDate')}</p>
            <p className="font-medium">{end_date ? end_date : t('tillNow')}</p>
          </div>
        </div>

        {description && (
          <div className="px-6 pb-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {!!environment?.length && (
          <div className="px-6 pb-5">
            <div className="flex flex-wrap gap-2">
              {environment.map((env) => (
                <span
                  key={env}
                  className="bg-muted text-muted-foreground border-border rounded-full border px-2.5 py-1 text-xs"
                >
                  {env}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
