import { DELETE_DEPARTMENT_MUTATION } from '@/api/graphql/mutations/departments'
import { useModalStore } from '@/store/modalStore'
import {
  DeleteDepartmentResponse,
  DeleteDepartmentVariables,
} from '@/types/department'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export function useDeleteDepartment() {
  const { data: modalData, closeModal } = useModalStore()
  const t = useTranslations('DepartmentToast')
  const [deleteDepartment, { loading }] = useMutation<
    DeleteDepartmentResponse,
    DeleteDepartmentVariables
  >(DELETE_DEPARTMENT_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Department', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deleteDepartment.affected > 0) {
        toast.success(t('departmentDeleteSuccess'))
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || t('departmentDeleteError'))
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error(t('departmentIdMissing'))
      return
    }

    deleteDepartment({
      variables: { department: { departmentId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}
