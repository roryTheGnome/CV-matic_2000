"use client";

import { useUser } from "@/lib/hooks/useUser";
import EditableProfile from "@/components/EditableProfile";
import Profile from "@/components/Profile";
import {useEffect, useState} from "react";
import {getAccessToken} from "@/actions/auth";
import {getCurrentUser} from "@/lib/GetCurrent";

export default function Employee(){

    const { user, isLoading, error } = useUser();

    const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined);

    useEffect(() => {
        async function fetchToken() {
            const token = await getAccessToken();
            if (token) {
                const currentUser = getCurrentUser(token);
                const id=currentUser?.sub;
                setCurrentUserId(id);
            }
        }
        fetchToken();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    if (!user) return <div>No User selected</div>;



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