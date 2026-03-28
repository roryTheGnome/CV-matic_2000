"use client"

import { CreateUserModal } from "@/components/modals/CreateUserModal"
import { DeleteModal } from "@/components/modals/DeleteUserModal"
import { useModalStore } from "@/store/modalStore"

export function ModalProvider() {
  const { type, data, isOpen, closeModal } = useModalStore()

  if (!isOpen) return null

  return (
    <>
      {type?.endsWith("_DELETE") && (
        <DeleteModal closeModal={closeModal} data={data} />
      )}
      {type === "USER_CREATE" && <CreateUserModal />}
    </>
  )
}
