"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUserNav } from "@/lib/hooks/nav/useUserNav";
import { useProjectNav } from '@/lib/hooks/nav/useProjectNav'

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

  const { user, error, displayName, currentPiece, formatLabel } = useUserNav();
  const { project, projectError,projectDisplayName } = useProjectNav();

  if (error|| projectError) return null; //TODO change me later

  const segments = pathname.split("/").filter(Boolean);

  const root = segments[0];
  const rootLabel = ROUTE_LABELS[root] || root;

  return (
    <nav className="mb-4 text-sm text-text-secondary flex items-center">
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
      {root === "projects" && project && (
        <>
          <ChevronRight size={20} />
          <Link href={`/projects/${project.id}`} className="text-xl text-primary">
            {projectDisplayName}
          </Link>
        </>
      )}
    </nav>
  );
}
