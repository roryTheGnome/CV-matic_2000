"use client";

import {useUser} from "@/lib/hooks/useUser";
import {Skills} from "@/components/skills/Skills";

export default function EmployeeSkill(){
    const { user, error } = useUser();

    if (error) return <div>Error loading users</div>;
    if (!user) return <div>No User selected</div>;
    return(
        <>
            <Skills skills={user.profile.skills} />
        </>
    )
}