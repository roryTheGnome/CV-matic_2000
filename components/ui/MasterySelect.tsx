import { Mastery } from '@/types/skills'
import { useTranslations } from 'next-intl'
import { SetStateAction } from 'react'
import { Option } from './select/Option'
import { Select } from './select/Select'

interface Props {
  mastery: Mastery
  setMastery: (value: SetStateAction<Mastery>) => void
}

export function MasterySelect({ mastery, setMastery }: Props) {
  const t = useTranslations('MasterySelect')

  return (
    <Select
      id="mastery"
      name="mastery"
      value={mastery}
      isRequired={true}
      title={t('mastery')}
      handleChange={(e) => setMastery(e.target.value as Mastery)}
    >
      <Option title={t('novice')} value="Novice" />
      <Option title={t('advanced')} value="Advanced" />
      <Option title={t('competent')} value="Competent" />
      <Option title={t('proficient')} value="Proficient" />
      <Option title={t('expert')} value="Expert" />
    </Select>
  )
}
