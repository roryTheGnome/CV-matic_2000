"use client"

import { useModalStore } from "@/store/modalStore"

import { SKILL_FRAGMENT } from "@/api/graphql/queries/skills"
import { client } from "@/lib/apollo-client"
import { SkillItem, SkillModalFormState } from "@/types/skills"
import { ModalLayout } from "../ModalLayout"
import { SkillForm } from "./SkillForm"

export function SkillModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === "SKILL_EDIT"

  const handleFetchFromCache = () => {
    if (!modalData?.id) {
      return
    }

    const editedItem = client.readFragment<SkillItem>({
      id: `Skill:${modalData?.id}`,
      fragment: SKILL_FRAGMENT,
    })

    return editedItem
  }

  const editedItem = handleFetchFromCache()

  const initialData: SkillModalFormState = {
    name: editedItem?.name || "",
    categoryId: editedItem?.category?.id || "",
  }

  return (
    <ModalLayout
      title={isEditing ? "Edit skill" : "Create skill"}
      maxWidth="max-w-5xl"
    >
      <SkillForm
        initialData={initialData}
        skillId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
