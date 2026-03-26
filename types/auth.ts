import { UserRole } from "./user"

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

export interface UpdateTokenResonse {
  access_token: string
  refresh_token: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ForgotPasswordVariables {
  auth: ForgotPasswordInput
}

export interface ForgotPasswordData {
  forgotPassword: null
}

export type RefreshTokenResult =
  | { success: true; accessToken: string }
  | { success: false; message: string }

export interface ResetPasswordInput {
  newPassword: string
}

export interface ResetPasswordVariables {
  auth: ResetPasswordInput
}

export interface ResetPasswordData {
  resetPassword: null
}

export interface TokenPayload {
  email: string
  role: UserRole
}
