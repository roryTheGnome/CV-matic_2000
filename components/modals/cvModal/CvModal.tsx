"use client"

import { GET_CV_BY_ID } from "@/api/graphql/queries/cvs"
import { useModalStore } from "@/store/modalStore"
import {
  CreateCvModalFormState,
  GetCvByIdData,
  GetCvByIdVariables,
} from "@/types/cvs"
import { useQuery } from "@apollo/client/react"
import toast from "react-hot-toast"
import { ModalLayout } from "../ModalLayout"
import { CvForm } from "./CvForm"

export function CvModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "CV_EDIT"

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    skip: !isEditing || !modalData?.id,
    variables: { cvId: modalData?.id || "" },
    fetchPolicy: "cache-and-network",
  })

  if (loading)
    return (
      <ModalLayout title="Loading...">
        <div className="p-8">Loading cv data...</div>
      </ModalLayout>
    )

  if (error) {
    toast.error("Failed to load cv: " + error.message)
    return null
  }

  const initialData: CreateCvModalFormState | undefined = editedItem?.cv
    ? {
        name: editedItem.cv.name || "",
        description: editedItem.cv.description || "",
        education: editedItem.cv.education || "",
        user: editedItem?.cv.user || null,
      }
    : undefined

  return (
    <ModalLayout
      title={isEditing ? "Edit cv" : "Create cv"}
      maxWidth="max-w-5xl"
    >
      <CvForm
        initialData={initialData}
        cvId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
