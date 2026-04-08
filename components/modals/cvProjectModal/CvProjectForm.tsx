import { Button } from '@/components/ui/Button'
import { CancelButton } from '@/components/ui/CancelButton'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { EnvironmentSelect } from '@/components/ui/EnvironmentSelect'
import { InputField } from '@/components/ui/inputField/InputField'
import { SearchableSelect } from '@/components/ui/searchableSelect/SearchableSelect'
import { TagInputField } from '@/components/ui/tagInputField/TagInputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { AddCvProjectModalFormState } from '@/types/cvs'
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
    projectsLoading,
    closeModal,
    handleChange,
    handleSubmit,
  } = useCvProjectModal(initialData, projectId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SearchableSelect
            inputId={`${formId}-project`}
            label={projectsLoading ? 'Loading projects...' : 'Project'}
            name="projectId"
            value={formData.projectId}
            options={projectOptions}
            onChange={handleChange}
            disabled={type === 'CV_PROJECT_EDIT'}
            required
          />
          <DatePickerField
            inputId={`${formId}-startDate`}
            label="Start Date"
            value={formData.start_date}
            onChange={handleChange}
            name="start_date"
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputField
            inputId={`${formId}-domain`}
            label="Domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="opacity-40"
            disabled
            required
          />
          <DatePickerField
            inputId={`${formId}-endDate`}
            label="End Date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <TextareaField
        inputId={`${formId}-description`}
        label="Description"
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
        label="Responsibilities"
        name="responsibilities"
        value={formData.responsibilities}
        onChange={handleChange}
      />

      <div className="mt-10 flex justify-end gap-4">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === 'PROJECT_CREATE'
              ? 'CREATING'
              : 'SAVING'
            : type === 'PROJECT_CREATE'
              ? 'CREATE'
              : 'SAVE'}
        </Button>
      </div>
    </form>
  )
}
