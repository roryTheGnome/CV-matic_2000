'use client'

import { useProfileNav } from '@/lib/hooks/useProfileNav'
import { useTranslations } from 'next-intl'
import { Tabs } from '../Tabs'
import { Loader } from '../ui/Loader'

export default function ProfileNav() {
  const { user, isLoading, error, tabs, isActive } = useProfileNav()
  const t = useTranslations('DataStates')

  if (error) {
    return <div>{t('errorOccurred') + error.message}</div>
  }
  if (isLoading) {
    return <Loader />
  }
  if (!user) {
    return null
  }

  return <Tabs tabs={tabs} isActive={isActive} />
}
