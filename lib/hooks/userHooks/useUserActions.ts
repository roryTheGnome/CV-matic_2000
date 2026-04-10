import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  UPDATE_PROFILE_MUTATION,
} from '@/api/graphql/mutations/user'
import { GET_USERS } from '@/api/graphql/queries/user'
import { useModalStore } from '@/store/modalStore'

import {
  CreateUserData,
  CreateUserModalFormState,
  CreateUserVariables,
  GetUsersResponse,
  UpdateUserData,
  UpdateUserVariables,
} from '@/types/user'
import { useMutation } from '@apollo/client/react'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function useUserActions(
  initialData?: CreateUserModalFormState,
  userId?: string,
) {
  const formId = useId()
  const { type, closeModal } = useModalStore()

  const [formData, setFormData] = useState<CreateUserModalFormState>(
    initialData || {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      departmentId: '',
      positionId: '',
      role: 'Employee',
    },
  )

  const [createUser, { loading: creating }] = useMutation<
    CreateUserData,
    CreateUserVariables
  >(CREATE_USER_MUTATION, {
    update(cache, { data }) {
      if (!data?.createUser) return

      const existingData = cache.readQuery<GetUsersResponse>({
        query: GET_USERS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [data.createUser, ...existingData.users],
          },
        })
      }
    },
    onCompleted: (data) => {
      toast.success('User created successfully!')
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    onError: (err) => toast.error(err.message),
  })

  const [updateUser, { loading: updating }] = useMutation<
    UpdateUserData,
    UpdateUserVariables
  >(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User updated successfully!')
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid = userId
    ? formData.firstName.trim() !== '' ||
      formData.lastName.trim() !== '' ||
      formData.email.trim() !== ''
    : Object.values(formData).every((v) => v.trim() !== '')

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof CreateUserModalFormState] !==
        initialData[key as keyof CreateUserModalFormState],
    )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    if (userId) {
      updateUser({
        variables: {
          user: {
            userId: userId,
            departmentId: formData.departmentId,
            positionId: formData.positionId,
            role: formData.role,
            cvsIds: [],
          },
        },
      })
      updateProfile({
        variables: {
          profile: {
            userId,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      })
    } else {
      createUser({
        variables: {
          user: {
            auth: { email: formData.email, password: formData.password },
            profile: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
            departmentId: formData.departmentId,
            positionId: formData.positionId,
            cvsIds: [],
            role: formData.role,
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
