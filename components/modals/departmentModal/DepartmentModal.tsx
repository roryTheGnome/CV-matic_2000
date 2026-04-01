"use client"

import { useModalStore } from "@/store/modalStore"

import { CreateDepartmentModalFormState } from "@/types/department"
import { ModalLayout } from "../ModalLayout"
import { DepartmentForm } from "./DepartmentForm"

export function DepartmentModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "DEPARTMENT_EDIT"

  const initialData: CreateDepartmentModalFormState = {
    name: modalData?.name || "",
  }

  return (
    <ModalLayout
      title={isEditing ? "Edit department" : "Create department"}
      maxWidth="max-w-5xl"
    >
      <DepartmentForm
        initialData={initialData}
        departmentId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
