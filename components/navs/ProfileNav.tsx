'use client'

import {usePathname} from "next/navigation";

import Link from "next/link";
import {useUser} from "@/lib/hooks/useUsesr";

export default function ProfileNav(){
    const pathname=usePathname();
    const { user, id } = useUser();

    if(!user) return <div>user not found</div> //TODO create a not found page n loging page

    const tabs=[
        {label:"Profile", path:`/users/${id}`},
        {label:"Skills", path:`/users/${id}/skills`},
        {label:"Languages", path:`/users/${id}/languages`},
    ];

    const isActive = (tabPath: string) => {
        if (pathname === tabPath) return true;
        if (tabPath !== `/users/${id}` && pathname.startsWith(tabPath + "/")) return true;
        return false;
    };

    return(

        <nav className="flex gap-6 border-b border-[var(--color-surface-active)] mb-6">
            {tabs.map((tab)=>{
                const active=isActive(tab.path);
                return(
                    <Link key={tab.path} href={tab.path}
                          className="relative pb-2 text-sm transition-colors duration-300"
                          style={{
                              color: active
                                  ? "var(--color-primary)"
                                  : "var(--color-text-secondary)",
                          }}>
                        {tab.label}
                        <span
                            className="absolute left-0 bottom-0 h-[2px] w-full transition-transform duration-300"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                transform: active ? "scaleX(1)" : "scaleX(0)",
                                transformOrigin: "left",
                            }}
                        />
                    </Link>
                )
            })}
        </nav>
    )




}