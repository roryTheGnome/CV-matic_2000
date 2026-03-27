"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {useUser} from "@/lib/hooks/useUser";
import { ChevronRight } from "lucide-react";
import {useUserNav} from "@/lib/hooks/useUserNav";


export default function UserNav() {
    const{user, isLoading, error, displayName, currentPiece, formatLabel,} =useUserNav();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;

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