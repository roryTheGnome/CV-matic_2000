// lib/hooks/useDeleteUser.ts
import { DELETE_USER_MUTATION } from "@/api/graphql/mutations/user"
import { DeleteUserResponse, DeleteUserVariables } from "@/types/user"
import { useMutation } from "@apollo/client/react"
import toast from "react-hot-toast"

export function useDeleteUser(
  userId: string | undefined,
  closeModal: () => void,
) {
  const [deleteUser, { loading }] = useMutation<
    DeleteUserResponse,
    DeleteUserVariables
  >(DELETE_USER_MUTATION, {
    // refetchQueries: ["GetUsers"], TODO: REFETCH ACTUAL USER QUERY

    onCompleted: data => {
      if (data.deleteUser.affected > 0) {
        toast.success("User successfully deleted")
        closeModal()
      }
    },
    onError: err => {
      toast.error(err.message || "Failed to delete user")
    },
  })

  const handleDelete = () => {
    if (!userId) {
      toast.error("User ID is missing!")
      return
    }

    deleteUser({
      variables: { userId },
    })
  }

  return { handleDelete, loading }
}
