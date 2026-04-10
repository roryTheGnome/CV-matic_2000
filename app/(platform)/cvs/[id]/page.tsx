'use client'

import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { CvForm } from '@/components/modals/cvModal/CvForm'
import { Loader } from '@/components/ui/Loader'
import {
  CreateCvModalFormState,
  GetCvByIdData,
  GetCvByIdVariables,
} from '@/types/cvs'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { use } from 'react'
import toast from 'react-hot-toast'

export default function CV({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('Notifications')

  const {
    data: editedItem,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <Loader />
  }

  if (error) {
    toast.error(t('errorOccurred') + error.message)
    return null
  }

  const initialData: CreateCvModalFormState | undefined = editedItem?.cv
    ? {
        name: editedItem.cv.name || '',
        description: editedItem.cv.description || '',
        education: editedItem.cv.education || '',
        user: editedItem?.cv.user || null,
      }
    : undefined

  return (
    <div className="mx-auto max-w-4xl p-6">
      <CvForm cvId={id} initialData={initialData} isModal={false} />
    </div>
  )
}
