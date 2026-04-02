import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { DatePickerField } from "@/components/ui/DatePickerField"
import { EnvironmentSelect } from "@/components/ui/EnvironmentSelect"
import { InputField } from "@/components/ui/inputField/InputField"
import { TextareaField } from "@/components/ui/TextareaField"
import { useProjectActions } from "@/lib/hooks/projectHooks/useProjectActions"
import { CreateProjectModalFormState } from "@/types/project"

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
    type,
    closeModal,
    handleChange,
    handleSubmit,
  } = useProjectActions(initialData, projectId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <InputField
            inputId={`${formId}-name`}
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
        required
      />
      <EnvironmentSelect
        formId={formId}
        value={formData.environment}
        handleChange={handleChange}
      />

      <div className="flex justify-end gap-4 mt-10">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === "PROJECT_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "PROJECT_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
