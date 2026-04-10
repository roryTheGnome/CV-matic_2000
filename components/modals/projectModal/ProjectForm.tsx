import { DatePickerField } from '@/components/ui/DatePickerField'
import { EnvironmentSelect } from '@/components/ui/EnvironmentSelect'
import { InputField } from '@/components/ui/inputField/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { useProjectActions } from '@/lib/hooks/projectHooks/useProjectActions'
import { CreateProjectModalFormState } from '@/types/project'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'

export function ProjectForm({
  initialData,
  projectId,
}: {
  initialData?: CreateProjectModalFormState
  projectId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    handleChange,
    handleSubmit,
  } = useProjectActions(initialData, projectId)

  const t = useTranslations('Forms')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
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
          <DatePickerField
            inputId={`${formId}-startDate`}
            label={t('startDate')}
            value={formData.start_date}
            onChange={handleChange}
            name="start_date"
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputField
            inputId={`${formId}-domain`}
            label={t('domain')}
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
            maxLength={50}
          />
          <DatePickerField
            inputId={`${formId}-endDate`}
            label={t('endDate')}
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <TextareaField
        inputId={`${formId}-description`}
        label={t('description')}
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        maxLength={1000}
      />
      <EnvironmentSelect
        formId={formId}
        value={formData.environment}
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
