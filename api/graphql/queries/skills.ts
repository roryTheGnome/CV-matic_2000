import { gql } from "@apollo/client"

export const GET_SKILL_CATEGORIES = gql`
  query GetSkillCategories {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
      }
      children {
        id
        name
        order
      }
    }
  }
`

export const GET_SKILLS = gql`
  query GetSkills {
    skills {
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

export const SKILL_FRAGMENT = gql`
  fragment SkillById on Skill {
    id
    created_at
    name
    category_name
    category {
      id
    }
    category_parent_name
  }
`
