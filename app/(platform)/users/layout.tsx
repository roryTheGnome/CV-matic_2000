"use client";

import UserNav from "@/components/navs/UserNav";

export default function EmployeesLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-6">
            <UserNav />
            <div>{children}</div>
        </div>
    );
}