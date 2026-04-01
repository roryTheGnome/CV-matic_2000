"use client";

import {useUser} from "@/lib/hooks/useUser";
import {LanguageList} from "@/components/LanguageList";
import LoadingPage from "@/app/(platform)/users/[id]/loading";
import NotFoundPage from "@/app/(platform)/users/not-found";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/Button";

export default function EmployeeLanguage(){
    const { user, error } = useUser();

    if (error) return <NotFoundPage/>;
    if (!user) return <LoadingPage/>;
    return(
        <>
            <LanguageList languages={user.profile.languages}/>

            {/*<Button*/}
            {/*    Icon={Plus}*/}
            {/*    isTextButton*/}
            {/*    className="text-red-400"*/}
            {/*    onClick={() => openModal("PROFILE_LANGUAGE_ADD")}*/}
            {/*>*/}
            {/*    ADD LANGUAGE*/}
            {/*</Button>*/}
        </>
    )
}