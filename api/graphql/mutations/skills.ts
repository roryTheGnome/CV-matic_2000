import { gql } from "@apollo/client"

export const CREATE_SKILL_MUTATION = gql`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      created_at
      name
      category_name
      category {
        id
      }
      category_parent_name
    }
  }
`

export const UPDATE_SKILL_MUTATION = gql`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      created_at
      name
      category_name
      category {
        id
      }
      category_parent_name
    }
  }
`

export const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`
