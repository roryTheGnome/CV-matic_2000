import { create } from "zustand"

export type ModalType =
  | "USER_CREATE"
  | "USER_DELETE"
  | "USER_EDIT"
  | "PROJECT_CREATE"
  | "PROJECT_DELETE"
  | "PROJECT_EDIT"
  | "CREATE_SKILL"
  | "DELETE_SKILL"
  | "SKILL_EDIT"
  | "DEPARTMENT_EDIT"
  | "DEPARTMENT_DELETE"
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
