"use client";

import {LanguageList} from "@/components/LanguageList";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import {useUser} from "@/lib/hooks/useUser";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";

export default function Language(){
    const { currentUserId } = useCurrentUser();

    const { user, error } = useUser(
        currentUserId ? String(currentUserId) : undefined
    );

    if (error) return <NotFoundPage />;
    if (!user) return <LoadingPage />;

    return(
        <div className="p-6">
            <h1>Languages Page</h1>
            <LanguageList languages={user.profile.languages}/>
        </div>
    )
}