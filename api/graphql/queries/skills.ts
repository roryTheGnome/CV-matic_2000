import { gql } from "@apollo/client";

export const GET_SKILLS = gql`
  query GetSkills {
    skills {
      id
      name
      category {
        id
      }
      category_name
    }
  }
`;
export const ADD_PROFILE_SKILL = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        mastery
      }
    }
  }
`;