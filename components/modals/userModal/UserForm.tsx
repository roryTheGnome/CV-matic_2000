import { useUserActions } from '@/lib/hooks/userHooks/useUserActions'
import { CreateUserModalFormState } from '@/types/user'
import { ModalButtons } from '../ModalButtons'
import { CreateUserLeftSide } from './CreateUserLeftSide'
import { CreateUserRightSide } from './CreateUserRightSide'

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
    handleChange,
    handleSubmit,
  } = useUserActions(initialData, userId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

      <ModalButtons
        isDirty={isDirty}
        isFormValid={isFormValid}
        saving={saving}
      />
    </form>
  )
}
