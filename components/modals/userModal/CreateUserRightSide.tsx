import { InputField } from '@/components/ui/inputField/InputField'
import { useTranslations } from 'next-intl'
import { PositionsSelect } from '../PositionsSelect'
import { CreateUserProps } from './CreateUserLeftSide'

export function CreateUserRightSide({
  formId,
  formData,
  handleChange,
}: CreateUserProps) {
  const t = useTranslations('Forms')
  return (
    <div className="flex flex-col gap-8">
      <InputField
        inputId={`${formId}-password`}
        label={t('password')}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        minLength={5}
      />
      <InputField
        inputId={`${formId}-lastName`}
        label={t('lastName')}
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        maxLength={50}
      />

      <PositionsSelect
        formId={formId}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  )
}
