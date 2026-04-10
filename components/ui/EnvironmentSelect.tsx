import { useLazyQuery } from '@apollo/client/react'

import { GET_POSITIONS } from '@/api/graphql/queries/positions'
import { GetPositionsResponse } from '@/types/position'
import { Position } from '@/types/user'
import { useTranslations } from 'next-intl'
import { ChangeEvent } from 'react'
import { MultiSelectField } from './multiSelectField/MultiSelectField'

interface Props {
  formId: string
  value: string
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void
}

export function EnvironmentSelect({ formId, value, handleChange }: Props) {
  const [getPositions, { data, loading, called }] =
    useLazyQuery<GetPositionsResponse>(GET_POSITIONS)

  const handleFocus = () => {
    if (!called) {
      getPositions()
    }
  }

  const options =
    data?.positions.map((position: Position) => ({
      id: position.id || position.name,
      name: position.name,
    })) || []

  const t = useTranslations('EnvironmentSelect')

  return (
    <MultiSelectField
      inputId={`${formId}-environment`}
      name="environment"
      label={t('environment')}
      value={value}
      options={options}
      loading={loading}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  )
}
