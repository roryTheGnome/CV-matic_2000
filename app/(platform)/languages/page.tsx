"use client";

import {LanguageList} from "@/components/LanguageList";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useUser} from "@/lib/hooks/useUser";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {useModalStore} from "@/store/modalStore";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/Button";

export default function Language(){
    const { currentUserId } = useCurrentUser();

    const { openModal } = useModalStore()

    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;

    return(
        <div className="p-6">
            <h1>Languages Page</h1>
            <LanguageList languages={user.profile.languages}/>

            <Button
                Icon={Plus}
                isTextButton
                className="text-red-400"
                onClick={() => openModal("PROFILE_LANGUAGE_ADD")}
            >
                ADD LANGUAGE
            </Button>
        </div>
    )
}