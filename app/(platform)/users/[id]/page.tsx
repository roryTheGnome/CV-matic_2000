"use client";

import { useUser } from "@/lib/hooks/useUser";
import EditableProfile from "@/components/EditableProfile";
import Profile from "@/components/Profile";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import NotFoundPage from "@/app/(platform)/users/not-found";

export default function Employee(){

    const { user, isLoading, error } = useUser();

    const {currentUserId} = useCurrentUser();

    if (error) return <NotFoundPage/>;

    if (isLoading || !user || currentUserId===undefined) {
        return <LoadingPage />;
    }

    return(
        <div className="p-6 max-w-4xl mx-auto">
            {currentUserId === Number(user.id) ? (
                <EditableProfile user={user} />
            ) : (
                <Profile user={user}/>
            )}
        </div>
    )
}