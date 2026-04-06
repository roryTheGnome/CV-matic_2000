import { gql } from '@apollo/client'

export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
        role
        profile {
          id
          full_name
          avatar
        }
      }
    }
  }
`
