import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { InputField } from "@/components/ui/inputField/InputField"
import { TextareaField } from "@/components/ui/TextareaField"
import { useCvActions } from "@/lib/hooks/useCvActions"
import { CreateCvModalFormState } from "@/types/cvs"

export function CvForm({
  initialData,
  cvId,
}: {
  initialData?: CreateCvModalFormState
  cvId?: string
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
  } = useCvActions(initialData, cvId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <InputField
          inputId={`${formId}-name`}
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          inputId={`${formId}-education`}
          label="Education"
          value={formData.education}
          onChange={handleChange}
          name="education"
        />

        <TextareaField
          inputId={`${formId}-description`}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === "CV_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "CV_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
