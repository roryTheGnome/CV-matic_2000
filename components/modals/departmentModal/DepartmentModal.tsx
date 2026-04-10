'use client'

import { useModalStore } from '@/store/modalStore'

import { CreateDepartmentModalFormState } from '@/types/department'
import { useTranslations } from 'next-intl'
import { ModalLayout } from '../ModalLayout'
import { DepartmentForm } from './DepartmentForm'

export function DepartmentModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === 'DEPARTMENT_EDIT'

  const initialData: CreateDepartmentModalFormState = {
    name: modalData?.name || '',
  }
  const t = useTranslations('DepartmentModal')

  return (
    <ModalLayout
      title={isEditing ? t('departmentEditModal') : t('departmentCreateModal')}
      maxWidth="max-w-5xl"
    >
      <DepartmentForm
        initialData={initialData}
        departmentId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
