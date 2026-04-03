import { gql } from "@apollo/client"

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`

export const LANGUAGES_FRAGMENT = gql`
  fragment LanguageById on Language {
    id
    created_at
    iso2
    name
    native_name
  }
`
