"use client"

import { useCreateUser } from "@/lib/hooks/useCreateUser"

import { Button } from "../ui/Button"
import { CancelButton } from "../ui/CancelButton"
import { ModalLayout } from "./ModalLayout"
import { CreateUserLeftSide } from "./createUser/CreateUserLeftSide"
import { CreateUserRightSide } from "./createUser/CreateUserRightSide"

export function CreateUserModal() {
  const {
    formData,
    formId,
    loading,
    isFormValid,
    closeModal,
    handleChange,
    handleRegister,
  } = useCreateUser()

  return (
    <ModalLayout title="Create user" maxWidth="max-w-5xl">
      <form onSubmit={handleRegister} className="space-y-6">
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
          <Button type="submit" disabled={!isFormValid || loading}>
            {loading ? "CREATING..." : "CREATE"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  )
}
