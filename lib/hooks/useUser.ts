import {GetUserResponse, User} from "@/types/user";
import {useQuery} from "@apollo/client/react";
import {GET_USER} from "@/lib/queries/user";
import {useParams} from "next/navigation";



export function useUser(userId?: string) {
    const params = useParams();
    const id = params.id as string;

    const idToUse=userId ?? id;


    const { data, loading, error } = useQuery<GetUserResponse>(GET_USER, {
        variables: { userId: idToUse },
        skip: !idToUse,
    });

    const user: User | undefined = data?.user

    return {
        user,
        isLoading: loading,
        error,
    };
}