import { User } from "@/types/user"
import { create } from "zustand"

export type ModalType =
  | "CREATE_USER"
  | "DELETE_USER"
  | "EDIT_USER"
  | "CREATE_PROJECT"
  | "DELETE_PROJECT"
  | "EDIT_PROJECT"
  | "CREATE_SKILL"
  | "DELETE_SKILL"
  | "EDIT_SKILL"
  | null

interface ModalStore {
  type: ModalType
  isOpen: boolean
  data: Partial<User> | undefined
  openModal: (type: ModalType, data?: Partial<User> | undefined) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  data: undefined,
  openModal: (type, data: Partial<User> | undefined) =>
    set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: undefined }),
}))
