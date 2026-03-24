export interface LoginVariables {
  auth: {
    email: string
    password: string
  }
}

export interface LoginResponse {
  login: {
    access_token: string
    refresh_token: string
    user: {
      id: string
      email: string
      role: "Employee" | "Admin"
      profile: {
        id: string
        full_name: string | null
        avatar: string | null
      }
    }
  }
}

export interface SignupResponse {
  signup: {
    access_token: string
    refresh_token: string
    user: {
      id: string
      email: string
      profile: {
        full_name: string | null
      }
    }
  }
}
