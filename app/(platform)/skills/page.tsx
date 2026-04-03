"use client";

import LoadingPage from "@/app/(platform)/users/[id]/loading"
import NotFoundPage from "@/app/(platform)/users/not-found"
import { Skills } from "@/components/skills/Skills"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"

export default function SkillsPage() {
    const { currentUserId } = useCurrentUser();

    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;

    return (
        <div className="p-6">
            <h1>Skills Page</h1>
            <Skills skills={user.profile.skills} />
        </div>
    );
}