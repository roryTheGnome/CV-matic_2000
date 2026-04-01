import { gql } from "@apollo/client"

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($department: UpdateDepartmentInput!) {
    updateDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($department: DeleteDepartmentInput!) {
    deleteDepartment(department: $department) {
      affected
    }
  }
`
