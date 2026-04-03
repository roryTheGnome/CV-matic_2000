import { GET_DEPARTMENTS } from "@/api/graphql/queries/departments"
import { GET_POSITIONS } from "@/api/graphql/queries/positions"
import { UPDATE_PROFILE, UPDATE_USER } from "@/api/graphql/queries/user"
import { GetDepartmentsResponse } from "@/types/department"
import { GetPositionsResponse } from "@/types/position"
import { User } from "@/types/user"
import { useMutation, useQuery } from "@apollo/client/react"
import { useState } from "react"
import toast from "react-hot-toast"

export const useEditableProfile = (user: User) => {
  const fullName = `${user.profile.first_name} ${user.profile.last_name}`

  const [firstName, setFirstName] = useState(user.profile.first_name || "")
  const [lastName, setLastName] = useState(user.profile.last_name || "")

  const [departmentId, setDepartmentId] = useState(user.department?.id || "")
  const [positionId, setPositionId] = useState(user.position?.id || "")

  const { data: depData, loading: depLoading } =
    useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS)
  const { data: posData, loading: posLoading } =
    useQuery<GetPositionsResponse>(GET_POSITIONS)

  const [updateProfile, { loading: profileLoading }] =
    useMutation(UPDATE_PROFILE)
  const [updateUser, { loading: userLoading }] = useMutation(UPDATE_USER)

  const loading = profileLoading || userLoading

  const handleSave = async () => {
    try {
      await updateProfile({
        variables: {
          profile: {
            userId: user.id,
            first_name: firstName,
            last_name: lastName,
          },
        },
      })
      await updateUser({
        variables: {
          user: {
            userId: user.id,
            departmentId,
            positionId,
          },
        },
      })
      toast.success("Profile updated successfully!")
    } catch (err) {
      toast.error("Upsi! Update failed:" + err)
    }
  }

  return {
    firstName,
    lastName,
    departmentId,
    positionId,
    fullName,
    depData,
    depLoading,
    posData,
    posLoading,
    loading,
    handleSave,
    setFirstName,
    setLastName,
    setDepartmentId,
    setPositionId,
  }
}
