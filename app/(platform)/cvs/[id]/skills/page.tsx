"use client"

import { DELETE_CV_SKILL } from "@/api/graphql/mutations/cv"
import { GET_CV_BY_ID } from "@/api/graphql/queries/cvs"
import { GET_SKILLS } from "@/api/graphql/queries/skills"
import { Skills } from "@/components/skills/Skills"
import { Loader } from "@/components/ui/Loader"
import {
  Cvs,
  DeleteCvSkillInput,
  GetCvByIdData,
  GetCvByIdVariables,
} from "@/types/cvs"
import { GetSkillsData } from "@/types/skills"
import { useMutation, useQuery } from "@apollo/client/react"
import { useParams } from "next/navigation"

export default function CvSkill() {
  const { id }: { id: string } = useParams()

  const {
    data: cvData,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
    fetchPolicy: "cache-and-network",
  })

  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useQuery<GetSkillsData>(GET_SKILLS)

  const [deleteSkills] = useMutation<Cvs, DeleteCvSkillInput>(DELETE_CV_SKILL, {
    refetchQueries: [
      {
        query: GET_CV_BY_ID,
        variables: { cvId: id },
      },
    ],
  })

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

  if (error || skillsError) {
    return <div className="text-red-500">Failed to load data.</div>
  }
  if (loading || skillsLoading) {
    return <Loader />
  }

  return (
    <Skills
      skills={cvData?.cv.skills}
      allSkills={skillsData?.skills || []}
      onDelete={handleDelete}
      owner={true}
    />
  )
}
