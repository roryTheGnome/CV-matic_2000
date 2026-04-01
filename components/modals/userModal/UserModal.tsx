"use client"

import { GET_USER_BY_ID } from "@/api/graphql/mutations/user"
import { useModalStore } from "@/store/modalStore"
import {
  CreateUserModalFormState,
  GetUserByIdData,
  GetUserByIdVariables,
} from "@/types/user"
import { useQuery } from "@apollo/client/react"
import toast from "react-hot-toast"
import { ModalLayout } from "../ModalLayout"
import { UserForm } from "./UserForm"

export function UserModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "USER_EDIT"

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetUserByIdData, GetUserByIdVariables>(GET_USER_BY_ID, {
    skip: !isEditing || !modalData?.id,
    variables: { userId: modalData?.id || "" },
    fetchPolicy: "cache-and-network",
  })

  if (loading)
    return (
      <ModalLayout title="Loading...">
        <div className="p-8">Loading user data...</div>
      </ModalLayout>
    )

  if (error) {
    toast.error("Failed to load user: " + error.message)
    return null
  }

  const initialData: CreateUserModalFormState | undefined = editedItem?.user
    ? {
        email: editedItem.user.email || "",
        password: "",
        firstName: editedItem.user.profile.first_name || "",
        lastName: editedItem.user.profile.last_name || "",
        departmentId: editedItem.user.department?.id || "",
        departmentName: editedItem.user.department?.name,
        positionName: editedItem.user.position?.name,
        positionId: editedItem.user.position?.id || "",
        role: editedItem.user.role || "Employee",
      }
    : undefined

  return (
    <ModalLayout
      title={isEditing ? "Edit user" : "Create user"}
      maxWidth="max-w-5xl"
    >
      <UserForm
        initialData={initialData}
        userId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
