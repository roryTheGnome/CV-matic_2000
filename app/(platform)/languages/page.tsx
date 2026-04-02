"use client";

import {LanguageList} from "@/components/LanguageList";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useUser} from "@/lib/hooks/useUser";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {useMutation} from "@apollo/client/react";
import {DELETE_PROFILE_LANGUAGE} from "@/api/graphql/mutations/profile";
import {GET_USER} from "@/api/graphql/queries/user";

export default function Language() {
    const { currentUserId } = useCurrentUser();

    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    const [deleteLanguages]=useMutation(DELETE_PROFILE_LANGUAGE,{
        refetchQueries:[
            {
                query:GET_USER,
                variables:{userId:currentUserId}
            }
        ]
    })

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;

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
        <div className="p-6">
            <LanguageList
                languages={user.profile.languages}
                onDelete={handleDelete}
                owner={true}
            />

        </div>
    )
}