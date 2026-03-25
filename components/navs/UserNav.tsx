"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {useUser} from "@/lib/hooks/useUsesr";
import { ChevronRight } from "lucide-react";


export default function UserNav() {
    const pathname=usePathname();
    const {user,id} = useUser();

    const pieces=pathname.split("/").filter(Boolean);
    const currentPiece=pieces[2];

    const formatLabel = (value: string) =>
        value.charAt(0).toUpperCase() + value.slice(1);

    return(
        <nav className="mb-4 text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
            <Link href="/users" className="hover:text-[var(--color-text-primary)]">
                Employees
            </Link>
            {id && user && (
                <>
                    <ChevronRight size={16}/>
                    <Link href={`/users/${id}`} className="hover:text-[var(--color-text-primary)]">
                        {user.profile.first_name} {user.profile.last_name}
                    </Link>

                    {currentPiece &&(
                        <>
                            <ChevronRight size={16}/>
                            <Link href={`/users/${id}/${formatLabel(currentPiece).toLowerCase()}`} className="hover:text-[var(--color-text-primary)]">
                                {formatLabel(currentPiece)}
                            </Link>
                        </>
                    )}
                </>
            )}

        </nav>

    )
}