import { DELETE_CV_SKILL_MUTATION } from '@/api/graphql/mutations/cv'
import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import {
  Cvs,
  DeleteCvSkillInput,
  GetCvByIdData,
  GetCvByIdVariables,
} from '@/types/cvs'
import { GetSkillsData } from '@/types/skills'
import { useMutation, useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'

export const useCvSkills = () => {
  const { id }: { id: string } = useParams()

  const {
    data: cvData,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useQuery<GetSkillsData>(GET_SKILLS, {
    fetchPolicy: 'cache-and-network',
  })

  const [deleteSkills] = useMutation<Cvs, DeleteCvSkillInput>(
    DELETE_CV_SKILL_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_CV_BY_ID,
          variables: { cvId: id },
        },
      ],
    },
  )

  const handleDelete = async (names: string[]) => {
    await deleteSkills({
      variables: {
        skill: {
          cvId: id,
          name: names,
        },
      },
    })
  }

  return {
    cvData,
    skillsData,
    id,
    error: error || skillsError,
    loading: loading || skillsLoading,
    handleDelete,
  }
}
