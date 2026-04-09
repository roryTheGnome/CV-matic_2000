'use client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { Cvs, GetCvByIdData } from '@/types/cvs'

export function useCv() {
  const params = useParams()
  const id = params.id as string

  const { data, loading, error } = useQuery<GetCvByIdData>(GET_CV_BY_ID, {
    variables: { cvId: id },
    skip: !id,
  })

  const cv: Cvs | undefined = data?.cv

  return {
    cv,
    isLoading: loading,
    error,
  }
}
