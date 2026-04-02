import { gql } from "@apollo/client"

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      department {
        id
        name
      }
      department_name
      position {
        id
        name
      }
      position_name
      profile {
        created_at
        first_name
        last_name
        avatar
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
  }
`

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      email
      department_name
      position_name
      profile {
        created_at
        first_name
        last_name
        avatar
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
  }
`

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`
