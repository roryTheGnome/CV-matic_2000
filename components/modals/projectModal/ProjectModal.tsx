'use client'

import { GET_PROJECT_BY_ID } from '@/api/graphql/queries/projects'
import { Loader } from '@/components/ui/Loader'
import { useModalStore } from '@/store/modalStore'
import { GetProjectByIdData, GetProjectByIdVariables } from '@/types/project'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { ModalLayout } from '../ModalLayout'
import { ProjectForm } from './ProjectForm'

export function ProjectModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === 'PROJECT_EDIT'
  const t = useTranslations('ProjectModal')

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetProjectByIdData, GetProjectByIdVariables>(GET_PROJECT_BY_ID, {
    skip: !isEditing || !modalData?.id,
    variables: { projectId: modalData?.id || '' },
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

  const initialData = editedItem?.project
    ? {
        name: editedItem.project.name || '',
        domain: editedItem.project.domain || '',
        start_date: editedItem.project.start_date || '',
        end_date: editedItem.project.end_date || '',
        description: editedItem.project.description || '',
        environment: editedItem.project.environment
          ? editedItem.project.environment.join(',')
          : '',
      }
    : undefined

  return (
    <ModalLayout
      title={isEditing ? t('editProject') : t('createProject')}
      maxWidth="max-w-5xl"
    >
      <ProjectForm
        initialData={initialData}
        projectId={isEditing ? modalData?.id : undefined}
      />
    </ModalLayout>
  )
}
