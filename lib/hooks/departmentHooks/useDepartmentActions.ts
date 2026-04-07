import {
  CREATE_DEPARTMENT_MUTATION,
  UPDATE_DEPARTMENT_MUTATION,
} from '@/api/graphql/mutations/departments'
import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { useModalStore } from '@/store/modalStore'
import {
  CreateDepartmentModalFormState,
  CreateDepartmentVariables,
  DepartmentData,
  GetDepartmentsResponse,
  UpdateDepartmentVariables,
} from '@/types/department'
import { useMutation } from '@apollo/client/react'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function useDepartmentActions(
  initialData?: CreateDepartmentModalFormState,
  departmentId?: string,
) {
  const formId = useId()
  const { type, closeModal } = useModalStore()

  const [formData, setFormData] = useState<CreateDepartmentModalFormState>(
    initialData || {
      name: '',
    },
  )

  const [createDepartment, { loading: creating }] = useMutation<
    DepartmentData,
    CreateDepartmentVariables
  >(CREATE_DEPARTMENT_MUTATION, {
    update(cache, { data }) {
      if (!data?.createDepartment) return

      const existingData = cache.readQuery<GetDepartmentsResponse>({
        query: GET_DEPARTMENTS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_DEPARTMENTS,
          data: {
            departments: [data.createDepartment, ...existingData.departments],
          },
        })
      }
    },
    onCompleted: (data) => {
      toast.success('Department created successfully!')
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const [updateDepartment, { loading: updating }] = useMutation<
    DepartmentData,
    UpdateDepartmentVariables
  >(UPDATE_DEPARTMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Department updated successfully!')
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid = formData.name.trim() !== '' && formData.name.trim() !== ''

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof CreateDepartmentModalFormState] !==
        initialData[key as keyof CreateDepartmentModalFormState],
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

    if (departmentId) {
      updateDepartment({
        variables: {
          department: {
            departmentId: departmentId,
            name: formData.name,
          },
        },
      })
    } else {
      createDepartment({
        variables: {
          department: {
            name: formData.name,
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
    closeModal,
    handleChange,
    handleSubmit,
  }
}
