export type Language = {
  id: number
  name: string
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
}

export interface LanguageItem {
  id: string
  created_at: string
  iso2: string
  name: string
  native_name: string
}

export interface GetLanguagesData {
  languages: LanguageItem[]
}

export interface LanguageModalFormState {
  iso2: string
  name: string
  native_name: string
}

export interface CreateLanguageVariables {
  language: LanguageModalFormState
}

export interface CreateLanguageData {
  createLanguage: LanguageItem
}

export interface UpdateLanguageVariables {
  language: LanguageModalFormState & { languageId: string }
}

export type UpdateLanguageData = {
  updateLanguage: LanguageItem
}

export interface DeleteLanguageVariables {
  language: {
    languageId: string
  }
}

export interface DeleteLanguageResponse {
  deleteLanguage: {
    affected: number
  }
}
