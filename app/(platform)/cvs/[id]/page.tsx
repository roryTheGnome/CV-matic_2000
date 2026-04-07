"use client"

import { GET_CV_BY_ID } from "@/api/graphql/queries/cvs"
import { CvForm } from "@/components/modals/cvModal/CvForm"
import { Loader } from "@/components/ui/Loader"
import {
  CreateCvModalFormState,
  GetCvByIdData,
  GetCvByIdVariables,
} from "@/types/cvs"
import { useQuery } from "@apollo/client/react"
import { use } from "react"
import toast from "react-hot-toast"

export default function CV({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
    fetchPolicy: "cache-and-network",
  })

  if (loading) {
    return <Loader title="Cv Details" />
  }

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
    <div className="p-6 max-w-4xl mx-auto">
      <CvForm cvId={id} initialData={initialData} isModal={false} />
    </div>
  )
}
