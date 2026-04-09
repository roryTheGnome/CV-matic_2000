import { gql } from '@apollo/client'

export const GET_CVS = gql`
  query GetCvs {
    cvs {
      id
      name
      education
      description
      created_at
    }
  }
`
export const GET_CV_BY_ID = gql`
  query GetCvById($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description

      user {
        id
        profile {
          first_name
          last_name
        }
        email
        position_name
        is_verified
      }

      projects {
        id
        name
        internal_name
        roles
        domain
        description
        start_date
        end_date
        environment
        responsibilities
        project {
          id
          name
          domain
          description
          start_date
          end_date
          environment
        }
      }

      skills {
        name
        categoryId
        mastery
      }

      languages {
        name
        proficiency
      }
    }
  }
`
