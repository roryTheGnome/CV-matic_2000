import { gql } from "@apollo/client"

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
