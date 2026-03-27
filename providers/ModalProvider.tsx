"use client"

import { CreateUserModal } from "@/components/modals/CreateUserModal"
import { DeleteUserModal } from "@/components/modals/DeleteUserModal"
import { useModalStore } from "@/store/modalStore"

export function ModalProvider() {
  const { type, isOpen } = useModalStore()

  if (!isOpen) return null

  return (
    <>
      {type === "CREATE_USER" && <CreateUserModal />}
      {type === "DELETE_USER" && <DeleteUserModal />}
    </>
  )
}
