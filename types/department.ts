export interface GetDepartmentsResponse {
  departments: Department[]
}

export interface Department {
  id: string
  name: string
}

export interface CreateDepartmentModalFormState {
  name: string
}

export interface CreateDepartmentVariables {
  department: {
    name: string
  }
}

export interface UpdateDepartmentVariables {
  department: {
    departmentId: string
    name: string
  }
}

export interface DepartmentData {
  createDepartment: {
    department: Department
  }
}

export interface DeleteDepartmentVariables {
  department: {
    departmentId: string
  }
}

export interface DeleteDepartmentResponse {
  deleteDepartment: {
    affected: number
  }
}
