import {
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
} from '@/api/graphql/mutations/project'
import { GET_PROJECTS } from '@/api/graphql/queries/projects'
import { useModalStore } from '@/store/modalStore'
import {
  CreateProjectData,
  CreateProjectModalFormState,
  CreateProjectVariables,
  GetProjectsData,
  Project,
  UpdateProjectData,
  UpdateProjectVariables,
} from '@/types/project'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function useProjectActions(
  initialData?: CreateProjectModalFormState,
  projectId?: string,
) {
  const formId = useId()
  const { type, closeModal } = useModalStore()
  const t = useTranslations('ProjectToast')
  const [formData, setFormData] = useState<CreateProjectModalFormState>(
    initialData || {
      name: '',
      domain: '',
      start_date: '',
      end_date: '',
      description: '',
      environment: '',
    },
  )

  const [createProject, { loading: creating }] = useMutation<
    CreateProjectData,
    CreateProjectVariables
  >(CREATE_PROJECT_MUTATION, {
    update(cache, { data }) {
      if (!data?.createProject) return

      const existingData = cache.readQuery<GetProjectsData>({
        query: GET_PROJECTS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_PROJECTS,
          data: {
            projects: [data.createProject, ...existingData.projects],
          },
        })
      }
    },
    onCompleted: () => {
      toast.success(t('projectCreatedSuccess'))
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const [updateProject, { loading: updating }] = useMutation<
    UpdateProjectData,
    UpdateProjectVariables
  >(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success(t('projectUpdatedSuccess'))
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      updateProject({
        variables: {
          project: {
            projectId,
            ...projectPayload,
          },
        },
      })
    } else {
      createProject({
        variables: {
          project: projectPayload,
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
    closeModal,
    handleChange,
    handleSubmit,
  }
}
