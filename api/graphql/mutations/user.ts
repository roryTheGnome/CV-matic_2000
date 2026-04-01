import { gql } from "@apollo/client"

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      created_at
      role
      profile {
        id
        first_name
        last_name
      }
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      affected
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      created_at
      email
      is_verified
      role
      department_name
      position_name
    }
  }
`

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    user(userId: $userId) {
      id
      created_at
      email
      is_verified
      role
      department_name
      position_name

      profile {
        first_name
        last_name
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
      cvs {
        id
        name
      }
    }
  }
`
