import { InputField } from '@/components/ui/inputField/InputField'
import { usePositionActions } from '@/lib/hooks/positionHooks/usePositionActions'
import { CreatePositionModalFormState } from '@/types/position'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'

export function PositionForm({
  initialData,
  positionId,
}: {
  initialData?: CreatePositionModalFormState
  positionId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    handleChange,
    handleSubmit,
  } = usePositionActions(initialData, positionId)

  const t = useTranslations('Forms')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        inputId={`${formId}-name`}
        label={t('name')}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        maxLength={50}
      />

      <ModalButtons
        isDirty={isDirty}
        isFormValid={isFormValid}
        saving={saving}
      />
    </form>
  )
}
