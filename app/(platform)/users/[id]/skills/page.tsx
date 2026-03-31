"use client";

import {useUser} from "@/lib/hooks/useUser";
import {Skills} from "@/components/skills/Skills";
import NotFoundPage from "@/app/(platform)/users/not-found";
import LoadingPage from "@/app/(platform)/users/[id]/loading";

export default function EmployeeSkill(){
    const { user, error } = useUser();

    if (error) return <NotFoundPage/>;
    if (!user) return <LoadingPage/>;
    return(
        <>
            <Skills skills={user.profile.skills} />
        </>
    )
}