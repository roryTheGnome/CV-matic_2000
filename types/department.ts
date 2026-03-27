export type Department = {
    id: string;
    name: string;
};

export type GetDepartmentsResponse = {
    departments: {
        id: string;
        name: string;
    }[];
};