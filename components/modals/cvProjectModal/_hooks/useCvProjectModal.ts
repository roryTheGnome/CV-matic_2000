import {
  ADD_CV_PROJECT_MUTATION,
  UPDATE_CV_PROJECT_MUTATION,
} from '@/api/graphql/mutations/cv'
import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { GET_PROJECTS } from '@/api/graphql/queries/projects'
import { useModalStore } from '@/store/modalStore'
import {
  AddCvProjectData,
  AddCvProjectModalFormState,
  AddCvProjectVariables,
  UpdateCvProjectData,
  UpdateCvProjectVariables,
} from '@/types/cvs'
import {
  CreateProjectModalFormState,
  GetProjectsData,
  Project,
} from '@/types/project'

import { useMutation, useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function useCvProjectModal(
  initialData?: AddCvProjectModalFormState,
  projectId?: string,
) {
  const t = useTranslations('ProjectToast')
  const formId = useId()
  const { data: modalData, type, closeModal } = useModalStore()
  const { id }: { id: string } = useParams()

  const [formData, setFormData] = useState<AddCvProjectModalFormState>(
    initialData || {
      cvId: modalData?.id || id,
      projectId: '',
      responsibilities: '',
      roles: '',
      start_date: '',
      end_date: '',

      description: '',
      domain: '',
      environment: '',
      name: '',
    },
  )

  const [
    addCvProject,
    { loading: addCvProjectLoading, error: addCvProjectError },
  ] = useMutation<AddCvProjectData, AddCvProjectVariables>(
    ADD_CV_PROJECT_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_CV_BY_ID,
          variables: { cvId: id },
        },
      ],
      onCompleted: () => {
        toast.success(t('cvProjectAdded'))
        closeModal()
      },
      onError: (err) => {
        toast.error(t('errorOccurred') + err.message)
      },
    },
  )

  const [updateCvProject, { loading: updating, error: updateCvProjectError }] =
    useMutation<UpdateCvProjectData, UpdateCvProjectVariables>(
      UPDATE_CV_PROJECT_MUTATION,
      {
        onCompleted: () => {
          toast.success(t('cvProjectUpdated'))
          closeModal()
        },
        onError: (err) => {
          toast.error(t('errorOccurred') + err.message)
        },
      },
    )

  const loading = addCvProjectLoading || updating

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.domain.trim() !== '' &&
    formData.start_date.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.environment.trim() !== ''

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof CreateProjectModalFormState] !==
        initialData[key as keyof CreateProjectModalFormState],
    )

  const { data: projectsData, loading: projectsLoading } =
    useQuery<GetProjectsData>(GET_PROJECTS)

  const projectOptions =
    projectsData?.projects.map((project) => ({
      label: project.name,
      value: project.id,
    })) || []

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target
    if (name === 'projectId') {
      const selectedProject = projectsData?.projects.find(
        (project) => project.id === value,
      )
      setFormData((prev) => ({
        ...prev,
        projectId: value,
        description: selectedProject?.description || '',
        domain: selectedProject?.domain || '',
        environment: selectedProject?.environment.join(',') || '',
        name: selectedProject?.description || '',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isDirty) {
      closeModal()
      return
    }

    const environmentArray = formData.environment
      .split(',')
      .map((env) => env.trim())
      .filter(Boolean)

    const projectPayload: Omit<Project, 'id'> = {
      name: formData.name,
      domain: formData.domain,
      start_date: formData.start_date,
      description: formData.description,
      environment: environmentArray,
    }

    if (formData.end_date && formData.end_date.trim() !== '') {
      projectPayload.end_date = formData.end_date
    }

    if (projectId) {
      updateCvProject({
        variables: {
          project: {
            cvId: id || formData?.cvId,
            projectId: formData?.projectId,
            responsibilities: formData?.responsibilities
              ? formData?.responsibilities.split(',')
              : [],
            roles: formData?.roles ? formData?.roles.split(',') : [],
            start_date: formData?.start_date,
            end_date: formData.end_date ? formData.end_date : null,
          },
        },
      })
    } else {
      addCvProject({
        variables: {
          project: {
            cvId: id || formData?.cvId,
            projectId: formData?.projectId,
            responsibilities: formData?.responsibilities
              ? formData?.responsibilities.split(',')
              : [],
            roles: formData?.roles ? formData?.roles.split(',') : [],
            start_date: formData?.start_date,
            end_date: formData.end_date ? formData.end_date : null,
          },
        },
      })
    }
  }

  return {
    formData,
    formId,
    loading,
    isFormValid,
    isDirty,
    type,
    addCvProjectError,
    updateCvProjectError,
    projectOptions,
    projectsLoading,
    closeModal,
    handleChange,
    handleSubmit,
  }
}
