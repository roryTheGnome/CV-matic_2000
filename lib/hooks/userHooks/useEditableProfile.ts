import { DELETE_AVATAR, UPLOAD_AVATAR } from '@/api/graphql/mutations/user'
import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { GET_POSITIONS } from '@/api/graphql/queries/positions'
import {
  GET_USER,
  UPDATE_PROFILE,
  UPDATE_USER,
} from '@/api/graphql/queries/user'
import { toBase64 } from '@/constants/toBase64'
import { GetDepartmentsResponse } from '@/types/department'
import { GetPositionsResponse } from '@/types/position'
import { UploadAvatarResponse, UploadAvatarVariables, User } from '@/types/user'
import { useMutation, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useEditableProfile = (user: User) => {
  const [firstName, setFirstName] = useState(user.profile.first_name || '')
  const [lastName, setLastName] = useState(user.profile.last_name || '')

  const [departmentId, setDepartmentId] = useState(user.department?.id || '')
  const [positionId, setPositionId] = useState(user.position?.id || '')

  const [changeSuccess, setChangeSuccess] = useState(false)

  const { data: depData, loading: depLoading } =
    useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS)
  const { data: posData, loading: posLoading } =
    useQuery<GetPositionsResponse>(GET_POSITIONS)

  const [updateProfile, { loading: profileLoading }] = useMutation(
    UPDATE_PROFILE,
    {
      refetchQueries: [
        {
          query: GET_USER,
          variables: { userId: user.id },
        },
      ],
    },
  )
  const [updateUser, { loading: userLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: user.id },
      },
    ],
    onCompleted: () => {
      toast.success(`Profile updated successfully`)
    },
    onError: (error) => {
      toast.success(`Error while updating profile` + error.message)
    },
  })

  const [uploadAvatar] = useMutation<
    UploadAvatarResponse,
    UploadAvatarVariables
  >(UPLOAD_AVATAR)
  const [deleteAvatar] = useMutation(DELETE_AVATAR)

  const [preview, setPreview] = useState<string | null>(
    user.profile?.avatar ?? null,
  )

  const hasChanges = () =>
    firstName !== (user.profile.first_name || '') ||
    lastName !== (user.profile.last_name || '') ||
    departmentId !== (user.department?.id || '') ||
    positionId !== (user.position?.id || '')
  const hasUnsavedChanges = hasChanges()
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await toBase64(file)

      const res = await uploadAvatar({
        variables: {
          avatar: {
            userId: user.id,
            base64,
            size: file.size,
            type: file.type,
          },
        },
      })

      if (res.data == undefined) return
      setPreview(res.data.uploadAvatar)
    } catch (err) {
      console.error('Avatar upload failed', err)
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar({
        variables: {
          avatar: { userId: user.id },
        },
      })

      setPreview(null)
    } catch (err) {
      console.error(err)
    }
  }

  const loading = profileLoading || userLoading

  const handleSave = async () => {
    setChangeSuccess(false)

    try {
      await Promise.allSettled([
        updateProfile({
          variables: {
            profile: {
              userId: user.id,
              first_name: firstName,
              last_name: lastName,
            },
          },
        }),
        updateUser({
          variables: {
            user: {
              userId: user.id,
              positionId: positionId ? positionId : '',
              departmentId: departmentId ? departmentId : '',
            },
          },
        }),
      ])
      setChangeSuccess(true)
    } catch (err) {
      console.error('Upsi! Update failed:', err)
    }
  }

  return {
    firstName,
    lastName,
    departmentId,
    positionId,
    depData,
    depLoading,
    posData,
    posLoading,
    loading,
    preview,
    hasUnsavedChanges,
    handleAvatarChange,
    handleDeleteAvatar,
    handleSave,
    setFirstName,
    setLastName,
    setDepartmentId,
    setPositionId,
  }
}
