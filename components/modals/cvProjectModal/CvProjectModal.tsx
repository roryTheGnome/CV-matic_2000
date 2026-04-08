'use client'

import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { useModalStore } from '@/store/modalStore'
import {
  AddCvProjectModalFormState,
  GetCvByIdData,
  GetCvByIdVariables,
} from '@/types/cvs'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ModalLayout } from '../ModalLayout'
import { CvProjectForm } from './CvProjectForm'

export function CvProjectModal() {
  const { data: modalData, type } = useModalStore()
  const isEditing = type === 'CV_PROJECT_EDIT'

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
      <ModalLayout title="Loading...">
        <div className="p-8">Loading project data...</div>
      </ModalLayout>
    )

  if (error) {
    toast.error('Failed to load project: ' + error.message)
    return null
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
      title={isEditing ? 'Edit CV project' : 'Add project'}
      maxWidth="max-w-5xl"
    >
      <CvProjectForm
        initialData={initialData}
        projectId={isEditing ? modalData?.projectId : undefined}
      />
    </ModalLayout>
  )
}
