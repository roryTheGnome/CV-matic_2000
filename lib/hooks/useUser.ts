"use client";

import {GetUserResponse, GetUsersResponse, User} from "@/types/user";
import {useQuery} from "@apollo/client/react";
import {GET_USER, GET_USERS} from "@/lib/queries/user";
import {useParams} from "next/navigation";

export function useUsers() {
    const { data, loading, error } = useQuery<GetUsersResponse>(GET_USERS);

    const users: User[] =
        data?.users?.map((u: User) => ({
            id: u.id,
            email: u.email,
            department_name: u.department_name,
            position_name: u.position_name,
            profile: {
                created_at: u.profile.created_at,
                first_name: u.profile.first_name,
                last_name: u.profile.last_name,
                avatar: u.profile.avatar,
                skills: u.profile.skills,
                languages:u.profile.languages,
            },
        })) || [];

    return {
        users,
        isLoading: loading,
        error,
    };
}


export function useUser() {
    const params = useParams();
    const id = params.id as string;

    const { data, loading, error } = useQuery<GetUserResponse>(GET_USER, {
        variables: { userId: id },
        skip: !id,
    });

    const user: User | null = data?.user
        ? {
            id: data.user.id,
            email: data.user.email,
            department_name: data.user.department_name,
            position_name: data.user.position_name,
            profile: {
                created_at: data.user.profile.created_at,
                first_name: data.user.profile.first_name,
                last_name: data.user.profile.last_name,
                avatar: data.user.profile.avatar,
                skills: data.user.profile.skills,
                languages: data.user.profile.languages
            },
        }
        : null;

    return {
        user,
        isLoading: loading,
        error,
    };
}