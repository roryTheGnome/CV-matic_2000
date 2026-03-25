"use client";

import ProfileNav from "@/components/navs/ProfileNav";

export default function EmployeeLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-6">
            <ProfileNav />
            <div>{children}</div>
        </div>
    );
}