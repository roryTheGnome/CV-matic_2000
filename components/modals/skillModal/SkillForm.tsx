import { InputField } from '@/components/ui/inputField/InputField'
import { useSkillActions } from '@/lib/hooks/skillHooks/useSkillActions'
import { SkillModalFormState } from '@/types/skills'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'
import { SkillSelect } from '../SkillCategorySelect'

export function SkillForm({
  initialData,
  skillId,
}: {
  initialData?: SkillModalFormState
  skillId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    handleChange,
    handleSubmit,
  } = useSkillActions(initialData, skillId)

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

      <SkillSelect
        formId={formId}
        formData={formData}
        handleChange={handleChange}
      />

      <ModalButtons
        isDirty={isDirty}
        isFormValid={isFormValid}
        saving={saving}
      />
    </form>
  )
}
