import { DELETE_DEPARTMENT_MUTATION } from "@/api/graphql/mutations/departments"
import { useModalStore } from "@/store/modalStore"
import {
  DeleteDepartmentResponse,
  DeleteDepartmentVariables,
} from "@/types/department"

import { useMutation } from "@apollo/client/react"
import toast from "react-hot-toast"

export function useDeleteDepartment() {
  const { data: modalData, closeModal } = useModalStore()

  const [deleteDepartment, { loading }] = useMutation<
    DeleteDepartmentResponse,
    DeleteDepartmentVariables
  >(DELETE_DEPARTMENT_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: "Department", id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: data => {
      if (data.deleteDepartment.affected > 0) {
        toast.success("Department successfully deleted")
        closeModal()
      }
    },
    onError: err => {
      toast.error(err.message || "Failed to delete department")
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error("Department ID is missing!")
      return
    }

    deleteDepartment({
      variables: { department: { departmentId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}
