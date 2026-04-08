import { gql } from '@apollo/client'

export const CREATE_CV_MUTATION = gql`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`

export const UPDATE_CV_MUTATION = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`

export const DELETE_CV_MUTATION = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`

export const DELETE_CV_SKILL_MUTATION = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
      created_at
      name
      education
      description

      user {
        id
        email
        profile {
          first_name
          last_name
        }
      }

      projects {
        id
        name
      }

      skills {
        name
      }

      languages {
        name
        proficiency
      }
    }
  }
`

export const ADD_CV_SKILL_MUTATION = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      created_at
      name
      education
      description

      user {
        id
        email
        profile {
          first_name
          last_name
        }
      }

      projects {
        id
        name
      }

      skills {
        name
        mastery
      }

      languages {
        name
        proficiency
      }
    }
  }
`

export const UPDATE_CV_SKILL_MUTATION = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
      created_at
      name
      education
      description

      user {
        id
        email
        profile {
          first_name
          last_name
        }
      }

      projects {
        id
        name
      }

      skills {
        name
        mastery
      }

      languages {
        name
        proficiency
      }
    }
  }
`

export const ADD_CV_PROJECT_MUTATION = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id

      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities

        project {
          id
          name
        }
      }
    }
  }
`

export const UPDATE_CV_PROJECT_MUTATION = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id

      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities

        project {
          id
          name
        }
      }
    }
  }
`

export const REMOVE_CV_PROJECT_MUTATION = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id

      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities

        project {
          id
          name
        }
      }
    }
  }
`
