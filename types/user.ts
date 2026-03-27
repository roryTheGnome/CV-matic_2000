import {Skill} from "@/types/skills";
import {Language} from "@/types/lang";

export type User = {
    id: string;
    email: string;
    department_name: string;
    position_name: string;
    profile: {
        created_at: string
        first_name: string;
        last_name: string;
        avatar?: string | null;
        skills: Skill[];
        languages: Language[];
    };
};

export type GetUsersResponse = {
    users: User[];
};

export type GetUserResponse = {
    user: User;
};