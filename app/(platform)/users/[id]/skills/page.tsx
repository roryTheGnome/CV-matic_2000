"use client";

import {useUser} from "@/lib/hooks/useUser";
import {Skills} from "@/components/skills/Skills";
import NotFoundPage from "@/app/(platform)/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_SKILLS} from "@/api/graphql/queries/skills";
import {GetSkillsData} from "@/types/skills";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {DELETE_PROFILE_SKILL} from "@/api/graphql/mutations/profile";
import {GET_USER} from "@/api/graphql/queries/user";

export default function EmployeeSkill(){
    const { user, error } = useUser();
    const { data: skillsData } = useQuery<GetSkillsData>(GET_SKILLS);

    const {currentUserId} = useCurrentUser();

    const [deleteSkills] = useMutation(DELETE_PROFILE_SKILL, {
        refetchQueries: [
            {
                query: GET_USER,
                variables: { userId: currentUserId },
            },
        ],
    });

    const handleDelete = async (names: string[]) => {
        await deleteSkills({
            variables: {
                skill: {
                    userId: currentUserId,
                    name: names,
                },
            },
        });
    };

    if (error) return <NotFoundPage/>;
    if (!user) return <LoadingPage/>;
    return(
        <>
            <Skills
                skills={user.profile.skills}
                allSkills={skillsData?.skills || []}
                onDelete={handleDelete}
                owner={currentUserId===Number(user.id)}
            />

        </>
    )
}