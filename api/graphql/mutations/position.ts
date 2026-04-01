import { gql } from "@apollo/client"

export const CREATE_POSITION_MUTATION = gql`
  mutation CreatePosition($position: CreatePositionInput!) {
    createPosition(position: $position) {
      id
      created_at
      name
    }
  }
`

export const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      id
      created_at
      name
    }
  }
`

export const DELETE_POSITION_MUTATION = gql`
  mutation DeletePosition($position: DeletePositionInput!) {
    deletePosition(position: $position) {
      affected
    }
  }
`
