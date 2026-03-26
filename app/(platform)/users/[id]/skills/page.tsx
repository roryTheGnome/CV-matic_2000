"use client";

import {useUser} from "@/lib/hooks/useUser";
import {Skills} from "@/components/skills/Skills";

export default function EmployeeSkill(){
    const{user}=useUser();
    if(!user) return <div>no user</div> //TODO again loading n 404
    return(
        <>
            <Skills skills={user.profile.skills} />
        </>
    )
}