'use client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import { GetProjectByIdData, Project } from '@/types/project'
import { GET_PROJECT_BY_ID } from '@/api/graphql/queries/projects'

export function useProject() {
  const params = useParams()
  const id = params.id as string


  const { data, loading, error } = useQuery<GetProjectByIdData>(GET_PROJECT_BY_ID, {
    variables: { projectId: id },
    skip: !id,
  })

  const project: Project | undefined = data?.project

  return {
    project,
    isLoading: loading,
    error,
  }
}
