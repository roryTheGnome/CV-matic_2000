import { gql } from '@apollo/client'

export const CREATE_LANGUAGE_MUTATION = gql`
  mutation CreateLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`

export const UPDATE_LANGUAGE_MUTATION = gql`
  mutation UpdateLanguage($language: UpdateLanguageInput!) {
    updateLanguage(language: $language) {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`

export const DELETE_LANGUAGE_MUTATION = gql`
  mutation DeleteLanguage($language: DeleteLanguageInput!) {
    deleteLanguage(language: $language) {
      affected
    }
  }
`
