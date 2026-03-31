import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { useUserActions } from "@/lib/hooks/useUserActions"
import { CreateUserModalFormState } from "@/types/user"
import { CreateUserLeftSide } from "./CreateUserLeftSide"
import { CreateUserRightSide } from "./CreateUserRightSide"

export function UserForm({
  initialData,
  userId,
}: {
  initialData?: CreateUserModalFormState
  userId?: string
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
  } = useUserActions(initialData, userId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CreateUserLeftSide
          formId={formId}
          formData={formData}
          handleChange={handleChange}
        />
        <CreateUserRightSide
          formId={formId}
          formData={formData}
          handleChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === "USER_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "USER_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
