import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { InputField } from "@/components/ui/inputField/InputField"
import { useDepartmentActions } from "@/lib/hooks/departmentHooks/useDepartmentActions"
import { CreateDepartmentModalFormState } from "@/types/department"

export function DepartmentForm({
  initialData,
  departmentId,
}: {
  initialData?: CreateDepartmentModalFormState
  departmentId?: string
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
  } = useDepartmentActions(initialData, departmentId)

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
            ? type === "DEPARTMENT_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "DEPARTMENT_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
