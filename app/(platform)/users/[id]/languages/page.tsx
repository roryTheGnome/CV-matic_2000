"use client";

import {useUser} from "@/lib/hooks/useUsesr";
import {LanguageList} from "@/components/LanguageList";

export default function EmployeeLanguage(){
    const{user}=useUser();
    if(!user) return <div>no user</div> //TODO again loading n 404
    return(
        <>
            <LanguageList languages={user.profile.languages}/>
        </>
    )
}