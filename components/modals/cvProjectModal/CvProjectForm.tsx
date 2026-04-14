import { DatePickerField } from '@/components/ui/DatePickerField'
import { EnvironmentSelect } from '@/components/ui/EnvironmentSelect'
import { InputField } from '@/components/ui/inputField/InputField'
import { SearchableSelect } from '@/components/ui/searchableSelect/SearchableSelect'
import { TagInputField } from '@/components/ui/tagInputField/TagInputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { AddCvProjectModalFormState } from '@/types/cvs'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../ModalButtons'
import { useCvProjectModal } from './_hooks/useCvProjectModal'

export function CvProjectForm({
  initialData,
  projectId,
}: {
  initialData?: AddCvProjectModalFormState
  projectId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    type,
    projectOptions,
    handleChange,
    handleSubmit,
  } = useCvProjectModal(initialData, projectId)

  const t = useTranslations('Forms')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SearchableSelect
            inputId={`${formId}-project`}
            label={t('project')}
            name="projectId"
            value={formData.projectId}
            options={projectOptions}
            onChange={handleChange}
            disabled={type === 'CV_PROJECT_EDIT'}
            required
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
            className="opacity-40"
            disabled
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
        className="opacity-40"
        disabled
        required
      />

      <EnvironmentSelect
        formId={formId}
        value={formData.environment}
        handleChange={handleChange}
      />

      <TagInputField
        inputId={`${formId}-responsibilities`}
        label={t('responsibilities')}
        name="responsibilities"
        value={formData.responsibilities}
        onChange={handleChange}
      />

      <ModalButtons
        isDirty={isDirty}
        isFormValid={isFormValid}
        saving={saving}
      />
    </form>
  )
}
