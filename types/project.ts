export interface Project {
  id: string
  created_at?: string
  name: string
  internal_name?: string
  domain: string
  start_date: string
  end_date?: string
  description: string
  environment: string[]
}

export interface GetProjectsData {
  projects: Project[]
}

export interface CreateProjectModalFormState {
  name: string
  domain: string
  start_date: string
  end_date: string
  description: string
  environment: string
}

export interface CreateProjectVariables {
  project: {
    name: string
    domain: string
    start_date: string
    end_date?: string | null
    description: string
    environment: string[]
  }
}

export interface CreateProjectData {
  createProject: {
    id: string
    name: string
  }
}

export interface GetProjectByIdVariables {
  projectId: string
}

export interface GetProjectByIdData {
  project: Project
}

export interface UpdateProjectVariables {
  project:
    | {
        projectId: string
      }
    | Project
}

export interface UpdateProjectData {
  updateProject: Project
}

export interface DeleteProjectVariables {
  project: {
    projectId: string
  }
}

export interface DeleteProjectResponse {
  deleteProject: {
    affected: number
  }
}
