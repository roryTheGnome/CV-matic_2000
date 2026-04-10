import { InputField } from '@/components/ui/inputField/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { useCvActions } from '@/lib/hooks/cvHooks/useCvActions'
import { CreateCvModalFormState } from '@/types/cvs'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'

interface Props {
  initialData?: CreateCvModalFormState
  cvId?: string
  isModal?: boolean
}

export function CvForm({ initialData, cvId, isModal = true }: Props) {
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
  } = useCvActions(initialData, cvId)

  const t = useTranslations('Forms')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
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
          inputId={`${formId}-education`}
          label={t('education')}
          value={formData.education}
          onChange={handleChange}
          name="education"
          maxLength={100}
        />

        <TextareaField
          inputId={`${formId}-description`}
          label={t('description')}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={1000}
        />
      </div>

      <ModalButtons
        isDirty={isDirty}
        isFormValid={isFormValid}
        saving={saving}
        isModal={isModal}
      />
    </form>
  )
}
