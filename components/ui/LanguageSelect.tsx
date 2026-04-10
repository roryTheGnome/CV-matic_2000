'use client'

import Cookies from 'js-cookie'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useTransition } from 'react'
import { Option } from './select/Option'
import { Select } from './select/Select'

export const LanguageSelect = () => {
  const currentLocale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => {
    const newLocale = e.target.value

    Cookies.set('USER_LOCALE', newLocale, { expires: 365 })

    startTransition(() => {
      router.refresh()
    })
  }
  const t = useTranslations('LanguageSelect')

  return (
    <Select
      id="language-select"
      handleChange={handleChange}
      name="Language"
      label={t('language')}
      value={currentLocale}
      disabled={isPending}
    >
      <Option title="English" value="en" />
      <Option title="Українська" value="uk" />
      <Option title="Русский" value="ru" />
      <Option title="German" value="de" />
    </Select>
  )
}
