"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useUser } from "@/lib/hooks/useUser";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {Skills} from "@/components/skills/Skills";
import {Plus} from "lucide-react";
import {useModalStore} from "@/store/modalStore";
import {Button} from "@/components/ui/Button";


export default function SkillsPage() {
    const { currentUserId } = useCurrentUser();

    const { openModal } = useModalStore()


    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;


    return (
        <div className="p-6">
            <h1>Skills Page</h1>
            <Skills skills={user.profile.skills} />

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