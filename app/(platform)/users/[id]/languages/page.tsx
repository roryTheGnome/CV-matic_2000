"use client";

import {useUser} from "@/lib/hooks/useUser";
import {LanguageList} from "@/components/LanguageList";

export default function EmployeeLanguage(){
    const { user, isLoading, error } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    if (!user) return <div>No User selected</div>;
    return(
        <>
            <LanguageList languages={user.profile.languages}/>
        </>
    )
}