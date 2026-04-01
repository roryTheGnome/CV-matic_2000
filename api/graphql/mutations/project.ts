import { gql } from "@apollo/client"

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      name
      internal_name
      domain
      start_date
      end_date
      description
      environment
      created_at
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      created_at
      name
      internal_name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`
