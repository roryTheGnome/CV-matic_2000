import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { InputField } from "@/components/ui/inputField/InputField"
import { usePositionActions } from "@/lib/hooks/positionHooks/usePositionActions"
import { CreatePositionModalFormState } from "@/types/position"

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
    type,
    closeModal,
    handleChange,
    handleSubmit,
  } = usePositionActions(initialData, positionId)

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
      />

      <div className="flex justify-end gap-4 mt-10">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === "POSITION_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "POSITION_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
