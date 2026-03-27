"use client";

import { useUser } from "@/lib/hooks/useUser";
import EditableProfile from "@/components/EditableProfile";

export default function Employee(){

    const { user, isLoading, error } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    if (!user) return <div>No User selected</div>;

    return(
        <div className="p-6 max-w-4xl mx-auto">
            <EditableProfile user={user} />
        </div>
    )
}