"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useUser } from "@/lib/hooks/useUser";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {Skills} from "@/components/skills/Skills";
import {Plus} from "lucide-react";
import {useModalStore} from "@/store/modalStore";
import {Button} from "@/components/ui/Button";
import {useQuery} from "@apollo/client/react";
import {GET_SKILLS} from "@/api/graphql/queries/skills";
import {GetSkillsData} from "@/types/skills";


export default function SkillsPage() {
    const { currentUserId } = useCurrentUser();

    const { openModal } = useModalStore()
    const { data: skillsData } = useQuery<GetSkillsData>(GET_SKILLS);


    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;


    return (
        <div className="p-6">
            <h1>Skills Page</h1>
            <Skills
                skills={user.profile.skills}
                allSkills={skillsData?.skills || []}
            />

            <Button
                Icon={Plus}
                isTextButton
                className="text-red-400"
                onClick={() => openModal("PROFILE_SKILL_ADD")}
            >
                ADD SKILL
            </Button>
        </div>
    );
}