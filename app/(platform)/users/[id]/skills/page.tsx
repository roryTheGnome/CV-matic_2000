"use client";

import {useUser} from "@/lib/hooks/useUser";
import {Skills} from "@/components/skills/Skills";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {useQuery} from "@apollo/client/react";
import {GET_SKILLS} from "@/api/graphql/queries/skills";
import {GetSkillsData} from "@/types/skills";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useModalStore} from "@/store/modalStore";

export default function EmployeeSkill(){
    const { user, error } = useUser();
    const { data: skillsData } = useQuery<GetSkillsData>(GET_SKILLS);

    const {currentUserId} = useCurrentUser();
    const { openModal } = useModalStore()

    if (error) return <NotFoundPage/>;
    if (!user) return <LoadingPage/>;
    return(
        <>
            <Skills
                skills={user.profile.skills}
                allSkills={skillsData?.skills || []}
            />

            {currentUserId===Number(user.id) && (
                <Button
                    Icon={Plus}
                    isTextButton
                    className="text-red-400"
                    onClick={() => openModal("PROFILE_SKILL_ADD")}
                >
                    ADD SKILL
                </Button>
            )}
        </>
    )
}