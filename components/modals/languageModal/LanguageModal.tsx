"use client"

import { useModalStore } from "@/store/modalStore"

import { LANGUAGES_FRAGMENT } from "@/api/graphql/queries/languages"
import { client } from "@/lib/apollo-client"
import { LanguageItem, LanguageModalFormState } from "@/types/languages"
import { ModalLayout } from "../ModalLayout"
import { LanguageForm } from "./LanguageForm"

export function LanguageModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "LANGUAGE_EDIT"

  const handleFetchFromCache = () => {
    if (!modalData?.id) {
      return
    }

    const editedItem = client.readFragment<LanguageItem>({
      id: `Language:${modalData?.id}`,
      fragment: LANGUAGES_FRAGMENT,
    })

    return editedItem
  }

  const editedItem = handleFetchFromCache()

  const initialData: LanguageModalFormState = {
    name: editedItem?.name || "",
    iso2: editedItem?.iso2 || "",
    native_name: editedItem?.native_name || "",
  }

  return (
    <ModalLayout
      title={isEditing ? "Edit language" : "Create language"}
      maxWidth="max-w-5xl"
    >
      <LanguageForm
        initialData={initialData}
        languageId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
