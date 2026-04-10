'use client'

import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { Loader } from '@/components/ui/Loader'
import { useModalStore } from '@/store/modalStore'
import {
  AddCvProjectModalFormState,
  GetCvByIdData,
  GetCvByIdVariables,
} from '@/types/cvs'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ModalLayout } from '../ModalLayout'
import { CvProjectForm } from './CvProjectForm'

export function CvProjectModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === 'CV_PROJECT_EDIT'
  const t = useTranslations('CvModal')

  const { id }: { id: string } = useParams()
  const {
    data: cvData,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
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

  const selectedProject = cvData?.cv?.projects.find(
    (cvProj) => cvProj.project?.id === modalData?.projectId,
  )

  const initialData: AddCvProjectModalFormState = {
    cvId: id,
    projectId: modalData?.projectId || '',
    responsibilities: selectedProject?.responsibilities
      ? selectedProject.responsibilities.join(',')
      : '',
    roles: selectedProject?.roles ? selectedProject.roles.join(',') : '',
    start_date: selectedProject?.start_date || '',
    end_date: selectedProject?.end_date || '',

    description: selectedProject?.description || '',
    domain: selectedProject?.domain || '',
    name: selectedProject?.name || '',
    environment: selectedProject?.environment
      ? selectedProject.environment.join(',')
      : '',
  }

  return (
    <ModalLayout
      title={isEditing ? t('cvEditProjectModal') : t('cvAddProjectModal')}
      maxWidth="max-w-5xl"
    >
      <CvProjectForm
        initialData={initialData}
        projectId={isEditing ? modalData?.projectId : undefined}
      />
    </ModalLayout>
  )
}
