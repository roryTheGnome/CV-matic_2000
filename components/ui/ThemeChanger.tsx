'use client'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { ChangeEvent } from 'react'
import { Option } from './select/Option'
import { Select } from './select/Select'

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => {
    setTheme(e.target.value)
  }

  const t = useTranslations('ThemeSelect')

  return (
    <Select
      id="theme-select"
      handleChange={handleChange}
      name="Appearance"
      label={t('appearance')}
      value={theme}
    >
      <Option title="System" value={'system'} />
      <Option title="Dark" value={'dark'} />
      <Option title="Light" value={'light'} />
    </Select>
  )
}
