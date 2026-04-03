"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {useUserNav} from "@/lib/hooks/userHooks/useUserNav";

const ROUTE_LABELS: Record<string, string> = {
    users: "Employees",
    languages: "Languages",
    skills: "Skills",
    cvs: "CVs",
    departments: "Departments",
    projects: "Projects",
    positions: "Positions",
};

export default function GlobalNav() {
    const pathname = usePathname();

    const{user, error, displayName, currentPiece, formatLabel,} =useUserNav();

    if (error) return null;//TODO change me later

    const segments = pathname.split("/").filter(Boolean);

    const root = segments[0];
    const rootLabel = ROUTE_LABELS[root] || root;

    return (
        <nav className="mb-4 text-sm text-text-secondary flex items-center gap-2">

            <Link href={`/${root}`} className="text-xl hover:text-text-primary">
            {rootLabel}
            </Link>

            {root === "users" && user && (
                 <>
                     <ChevronRight size={20} />
                     <Link href={`/users/${user.id}`} className="text-xl text-primary">
                        {displayName}
                     </Link>
                     {currentPiece && (
                         <>
                             <ChevronRight size={16} />
                             <Link
                                href={`/users/${user.id}/${formatLabel(currentPiece).toLowerCase()}`}
                                className="text-xl hover:text-text-primary"
                             >
                                {formatLabel(currentPiece)}
                            </Link>
                            </>
                    )}
                </>
            )}

    </nav>
);
}