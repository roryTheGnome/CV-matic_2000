export type Proficiency =
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1"
    | "C2"
    | "Native";


export type Language = {
  id: string;
  created_at: string;
  iso2: string;
  name: string;
  native_name?: string;
};


export type LanguageProficiency = {
  name: string;
  proficiency: Proficiency;
};


export type GetLanguagesData = {
  languages: Language[];
};


export type AddProfileLanguageInput = {
  userId: string;
  name: string;
  proficiency: Proficiency;
};