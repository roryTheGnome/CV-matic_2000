import { gql } from "@apollo/client"

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
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

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    project(projectId: $projectId) {
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
