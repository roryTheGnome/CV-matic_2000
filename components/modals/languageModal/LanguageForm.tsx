import { Button } from '@/components/ui/Button'
import { CancelButton } from '@/components/ui/CancelButton'
import { InputField } from '@/components/ui/inputField/InputField'
import { useLanguageActions } from '@/lib/hooks/languageHooks/useLanguageActions'
import { LanguageModalFormState } from '@/types/languages'

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
    type,
    closeModal,
    handleChange,
    handleSubmit,
  } = useLanguageActions(initialData, languageId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        inputId={`${formId}-name`}
        label="Name"
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
        label="Native name"
        type="text"
        name="native_name"
        value={formData.native_name}
        onChange={handleChange}
        maxLength={50}
      />

      <div className="mt-10 flex justify-end gap-4">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === 'LANGUAGE_CREATE'
              ? 'CREATING'
              : 'SAVING'
            : type === 'LANGUAGE_CREATE'
              ? 'CREATE'
              : 'SAVE'}
        </Button>
      </div>
    </form>
  )
}
