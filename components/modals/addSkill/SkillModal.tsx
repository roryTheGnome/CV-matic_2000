"use client";

import { SkillForm } from "./SkillForm";
import {ModalLayout} from "@/components/modals/ModalLayout";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useUser} from "@/lib/hooks/useUser";

export function SkillModal() {
    const { currentUserId } = useCurrentUser();
    const { user, isLoading, error } = useUser(
        currentUserId ?String(currentUserId):undefined
    );

    if (isLoading) {return <div className="p-6">Loading...</div>} //TODO create something gloabal for default
    if (error || !user) {return <div className="p-6">Failed to load user</div>}
    return (
        <ModalLayout title="Add Skill">
            <SkillForm userSkills={user.profile.skills} />
        </ModalLayout>
    );
}