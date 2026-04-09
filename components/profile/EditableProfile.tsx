import { UploadAvatarResponse, UploadAvatarVariables, User } from '@/types/user'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Department, GetDepartmentsResponse } from '@/types/department'
import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { GetPositionsResponse, Position } from '@/types/position'
import { GET_POSITIONS } from '@/api/graphql/queries/positions'
import {
  GET_USER,
  UPDATE_PROFILE,
  UPDATE_USER,
} from '@/api/graphql/queries/user'
import { DELETE_AVATAR, UPLOAD_AVATAR } from '@/api/graphql/mutations/user'
import { toBase64 } from '@/constants/toBase64'

type ProfileProp = {
  user: User
}

export default function EditableProfile({ user }: ProfileProp) {
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
  return (
    <>
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="group relative">
            <img
              src={preview ?? 'https://placehold.co/120'} //TODO change this later to non human waiting thing
              className="bg-surface h-32 w-32 rounded-full object-cover"
            />

            <label className="bg-background/60 text-text-primary absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full px-2 text-center text-xs opacity-0 transition group-hover:opacity-100">
              <span className="font-medium">Upload avatar image</span>
              <span className="mt-1 text-[10px] opacity-80">
                png, jpg or gif (max 0.5MB)
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {preview && (
            <button
              onClick={handleDeleteAvatar}
              className="text-text-secondary hover:text-primary mt-3 text-sm transition"
            >
              Remove avatar
            </button>
          )}
        </div>
        <p className="text-text-secondary text-sm">{user.email}</p>

        <p className="text-text-secondary text-sm">
          A member since{' '}
          {new Date(Number(user.profile.created_at)).toDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col">
          <label className="text-text-secondary text-sm">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-surface mt-1 rounded border p-3"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-text-secondary text-sm">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-surface mt-1 rounded border p-3"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-text-secondary text-sm">Department</label>

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="bg-surface mt-1 rounded border p-3"
            disabled={depLoading}
          >
            <option value="" disabled>
              {user?.department_name ?? 'Select Department'}
            </option>

            {depData?.departments.map((dep: Department) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-text-secondary text-sm">Position</label>

          <select
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            className="bg-surface mt-1 rounded border p-3"
            disabled={posLoading}
          >
            <option value="" disabled>
              {user?.position_name ?? 'Select position'}
            </option>

            {posData?.positions.map((pos: Position) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading || !hasUnsavedChanges}
        className={`mt-6 rounded px-4 py-2 text-white ${
          loading || !hasUnsavedChanges ? 'bg-surface-disabled' : 'bg-primary'
        }`}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      {changeSuccess && (
        <p className="mt-3 text-sm text-green-500">
          Profile updated successfully; pls change me to toast lrt
        </p>
      )}
    </>
  )
}
