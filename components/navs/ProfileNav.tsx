'use client'

import Link from "next/link";
import {useProfileNav} from "@/lib/hooks/useProfileNav";

export default function ProfileNav(){
    const {user,isLoading,error,tabs, isActive}=useProfileNav();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    if (!user) return <div>No User selected</div>;

    return(

        <nav className="flex gap-6 border-b border-surface-active mb-6">
            {tabs.map((tab)=>{
                const active=isActive(tab.path);
                return(
                    <Link key={tab.path} href={tab.path}
                          className="relative pb-2  transition-colors duration-300"
                          style={{
                              color: active
                                  ? "var(--color-primary)"
                                  : "var(--color-text-secondary)",
                          }}>
                        {tab.label}
                        <span
                            className="absolute left-0 bottom-0 h-0.5 w-full transition-transform duration-300"
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