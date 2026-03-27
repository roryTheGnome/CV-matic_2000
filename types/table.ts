export type SortKey =
    | "first_name"
    | "last_name"
    | "email"
    | "department"
    | "position";

export type Header={
    label:string
    key:SortKey}