'use client'

import { GET_USER_BY_ID } from '@/api/graphql/mutations/user'
import { Loader } from '@/components/ui/Loader'
import { useModalStore } from '@/store/modalStore'
import {
  CreateUserModalFormState,
  GetUserByIdData,
  GetUserByIdVariables,
} from '@/types/user'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { ModalLayout } from '../ModalLayout'
import { UserForm } from './UserForm'

export function UserModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === 'USER_EDIT'
  const t = useTranslations('UserModal')

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetUserByIdData, GetUserByIdVariables>(GET_USER_BY_ID, {
    skip: !isEditing || !modalData?.id,
    variables: { userId: modalData?.id || '' },
    fetchPolicy: 'cache-and-network',
  })

  if (loading)
    return (
      <ModalLayout title={t('loading')}>
        <Loader />
      </ModalLayout>
    )

  if (error) {
    return (
      <ModalLayout title={t('errorOccurred')}>
        <div>{error.message}</div>
      </ModalLayout>
    )
  }

  const initialData: CreateUserModalFormState | undefined = editedItem?.user
    ? {
        email: editedItem.user.email || '',
        password: '',
        firstName: editedItem.user.profile.first_name || '',
        lastName: editedItem.user.profile.last_name || '',
        departmentId: editedItem.user.department?.id || '',
        departmentName: editedItem.user.department?.name,
        positionName: editedItem.user.position?.name,
        positionId: editedItem.user.position?.id || '',
        role: editedItem.user.role || 'Employee',
      }
    : undefined

  return (
    <ModalLayout
      title={isEditing ? t('editUser') : t('createUser')}
      maxWidth="max-w-5xl"
    >
      <UserForm
        initialData={initialData}
        userId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
