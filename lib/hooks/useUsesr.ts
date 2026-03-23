"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { mockUsers } from "@/lib/mockUsers";

export function useUser() {
    const params = useParams();
    const id = params.id as string;

    const user = useMemo(
        () => mockUsers.find((u) => u.id === id),
        [id]
    );

    return { user, id };
}