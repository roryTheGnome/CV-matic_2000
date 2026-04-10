'use client'

import { useCvNav } from '@/lib/hooks/useCvNav'
import { useTranslations } from 'next-intl'
import { Tabs } from '../Tabs'
import { Loader } from '../ui/Loader'

export default function CvNav() {
  const { cv, error, isLoading, tabs, isActive } = useCvNav()
  const t = useTranslations('DataStates')

  if (error) {
    return <div>{t('errorOccurred') + error.message}</div>
  }
  if (isLoading) {
    return <Loader />
  }
  if (!cv) {
    return null
  }

  return <Tabs tabs={tabs} isActive={isActive} />
}
