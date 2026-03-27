"use client"

import { useDeleteUser } from "@/lib/hooks/useDeleteUser"
import { useModalStore } from "@/store/modalStore"

import { Button } from "../ui/Button"
import { CancelButton } from "../ui/CancelButton"
import { ModalLayout } from "./ModalLayout"

export function DeleteUserModal() {
  const { closeModal, data } = useModalStore()

  const userId = data?.id

  const { handleDelete, loading } = useDeleteUser(userId, closeModal)

  return (
    <ModalLayout title="Delete user" maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        <p className="text-gray-300 text-lg">
          Are you sure you want to delete user {"User Name"}?
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <CancelButton closeModal={closeModal} />

          <Button onClick={handleDelete} disabled={loading || !userId}>
            {loading ? "DELETING..." : "CONFIRM"}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}
