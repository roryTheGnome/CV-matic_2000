import { gql } from "@apollo/client"

export const GET_CVS = gql`
  query GetCvs {
    cvs {
      id
      name
      education
      description
      created_at
      user {
        id
        email
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
