import { create } from "zustand"

export type ModalType =
  | "USER_CREATE"
  | "USER_DELETE"
  | "USER_EDIT"
  | "PROFILE_SKILL_ADD"
  | "PROJECT_CREATE"
  | "PROJECT_DELETE"
  | "PROJECT_EDIT"
  | "SKILL_CREATE"
  | "SKILL_DELETE"
  | "SKILL_EDIT"
  | "DEPARTMENT_CREATE"
  | "DEPARTMENT_EDIT"
  | "DEPARTMENT_DELETE"
  | "CV_EDIT"
  | "CV_DELETE"
  | "CV_CREATE"
  | null

export interface ModalData {
  id: string
  name: string
}

interface ModalStore {
  type: ModalType
  isOpen: boolean
  data: ModalData | undefined
  openModal: (type: ModalType, data?: ModalData | undefined) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  data: undefined,
  openModal: (type, data: ModalData | undefined) =>
    set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: undefined }),
}))
