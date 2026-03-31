"use client"

import { ProjectModal } from "@/components/modals/createProject/ProjectModal"
import { UserModal } from "@/components/modals/createUser/UserModal"

import { DeleteModal } from "@/components/modals/DeleteUserModal"
import { useModalStore } from "@/store/modalStore"
import {SkillModal} from "@/components/modals/addSkill/SkillModal";

export function ModalProvider() {
  const { type, data, isOpen, closeModal } = useModalStore()

  if (!isOpen) return null

  return (
    <>
      {type?.endsWith("_DELETE") && (
        <DeleteModal closeModal={closeModal} data={data} />
      )}
      {type === "USER_CREATE" && <UserModal />}
      {type === "USER_EDIT" && <UserModal />}
      {type === "PROJECT_CREATE" && <ProjectModal />}
      {type === "PROJECT_EDIT" && <ProjectModal />}
      {type === "PROFILE_SKILL_ADD" && <SkillModal  />}
    </>
  )
}
