import { InputField } from '@/components/ui/inputField/InputField'
import { useLanguageActions } from '@/lib/hooks/languageHooks/useLanguageActions'
import { LanguageModalFormState } from '@/types/languages'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'

export function LanguageForm({
  initialData,
  languageId,
}: {
  initialData?: LanguageModalFormState
  languageId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    handleChange,
    handleSubmit,
  } = useLanguageActions(initialData, languageId)

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

      <InputField
        inputId={`${formId}-iso2`}
        label="ISO2"
        type="text"
        maxLength={2}
        name="iso2"
        value={formData.iso2}
        onChange={handleChange}
        required
      />

      <InputField
        inputId={`${formId}-nativeName`}
        label={t('nativeName')}
        type="text"
        name="native_name"
        value={formData.native_name}
        onChange={handleChange}
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
