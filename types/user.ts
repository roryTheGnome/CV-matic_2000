import {Skill} from "@/types/skills";
import {Language} from "@/types/lang";
import {Department} from "@/types/department";
import {Position} from "@/types/position";

export type User = {
    id: string;
    email: string;
    department?:Department;
    department_name?: string;
    position?:Position;
    position_name?: string;
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