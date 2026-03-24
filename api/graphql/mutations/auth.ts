import { gql } from "@apollo/client"

export const SIGNUP_MUTATION = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
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

export const UPDATE_TOKEN_MUTATION = gql`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`
