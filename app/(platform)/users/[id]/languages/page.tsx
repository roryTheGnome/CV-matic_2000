"use client";

import {useUser} from "@/lib/hooks/useUser";
import {LanguageList} from "@/components/LanguageList";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import NotFoundPage from "@/app/(platform)/users/not-found";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useMutation} from "@apollo/client/react";
import {DELETE_PROFILE_LANGUAGE} from "@/api/graphql/mutations/profile";
import {GET_USER} from "@/api/graphql/queries/user";

export default function EmployeeLanguage(){
    const { user, error } = useUser();

    const {currentUserId} = useCurrentUser();

    const [deleteLanguages]=useMutation(DELETE_PROFILE_LANGUAGE,{
        refetchQueries:[
            {
                query:GET_USER,
                variables:{userId:currentUserId}
            }
        ]
    })

    if (error) return <NotFoundPage/>;
    if (!user) return <LoadingPage/>;

    const handleDelete=async (names: string[])=>{
        await deleteLanguages({
            variables:{
                language:{
                    userId:currentUserId,
                    name:names
                }
            }
        });
    }

    return(
        <>
            <LanguageList
                languages={user.profile.languages}
                onDelete={handleDelete}
                owner={currentUserId===Number(user.id)}
            />

        </>
    )
}