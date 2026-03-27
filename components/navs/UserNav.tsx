"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {useUser} from "@/lib/hooks/useUser";
import { ChevronRight } from "lucide-react";


export default function UserNav() {
    const pathname=usePathname();
    const { user, isLoading, error } = useUser();
    let displayName="Unnamed User"

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    if(user){
        const fullName=`${user.profile.first_name} ${user.profile.last_name}`;
        displayName = fullName ;
    }

    const pieces=pathname.split("/").filter(Boolean);
    const currentPiece=pieces[2];

    const formatLabel = (value: string) =>
        value.charAt(0).toUpperCase() + value.slice(1);

    return(
        <nav className="mb-4 text-sm text-text-secondary flex items-center gap-2">
            <Link href="/users" className="hover:text-text-primary">
                Employees
            </Link>
            {user && (
                <>
                    <ChevronRight size={16}/>
                    <Link href={`/users/${user.id}`} className="hover:text-text-primary">
                        {displayName}
                    </Link>

                    {currentPiece &&(
                        <>
                            <ChevronRight size={16}/>
                            <Link href={`/users/${user.id}/${formatLabel(currentPiece).toLowerCase()}`} className="hover:text-text-primary">
                                {formatLabel(currentPiece)}
                            </Link>
                        </>
                    )}
                </>
            )}

        </nav>

    )
}