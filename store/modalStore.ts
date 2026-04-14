import { LanguageProficiency } from '@/types/lang'
import { SkillMastery } from '@/types/skills'
import { create } from 'zustand'

export type ModalType =
  | 'USER_CREATE'
  | 'USER_DELETE'
  | 'USER_EDIT'
  | 'PROFILE_SKILL_ADD'
  | 'PROFILE_SKILL_EDIT'
  | 'PROFILE_LANGUAGE_ADD'
  | 'PROFILE_LANGUAGE_EDIT'
  | 'PROJECT_CREATE'
  | 'PROJECT_DELETE'
  | 'PROJECT_EDIT'
  | 'SKILL_CREATE'
  | 'SKILL_DELETE'
  | 'SKILL_EDIT'
  | 'DEPARTMENT_CREATE'
  | 'DEPARTMENT_EDIT'
  | 'DEPARTMENT_DELETE'
  | 'CV_EDIT'
  | 'CV_DELETE'
  | 'CV_CREATE'
  | 'POSITION_CREATE'
  | 'POSITION_EDIT'
  | 'POSITION_DELETE'
  | 'LANGUAGE_CREATE'
  | 'LANGUAGE_EDIT'
  | 'LANGUAGE_DELETE'
  | 'CV_SKILL_ADD'
  | 'CV_SKILL_EDIT'
  | 'CV_PROJECT_ADD'
  | 'CV_PROJECT_EDIT'
  | 'CV_PROJECT_DELETE'
  | null

export interface ModalData {
  id?: string
  name?: string
  language?: LanguageProficiency
  skill?: SkillMastery
  projectId?: string
}

interface ModalStore {
  type: ModalType
  isOpen: boolean
  data: ModalData | undefined
  openModal: (type: ModalType, data?: ModalData | undefined) => void
  closeModal: () => void
  setModalData: (data: ModalData) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: undefined,
  openModal: (type, data: ModalData | undefined) =>
    set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: undefined }),
  setModalData: (data: ModalData) => set({ data }),
}))
