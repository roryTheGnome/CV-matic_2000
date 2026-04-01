"use client"

import { useModalStore } from "@/store/modalStore"

import { CreatePositionModalFormState } from "@/types/position"
import { ModalLayout } from "../ModalLayout"
import { PositionForm } from "./PositionForm"

export function PositionModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "POSITION_EDIT"

  const initialData: CreatePositionModalFormState = {
    name: modalData?.name || "",
  }

  return (
    <ModalLayout
      title={isEditing ? "Edit position" : "Create position"}
      maxWidth="max-w-5xl"
    >
      <PositionForm
        initialData={initialData}
        positionId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
