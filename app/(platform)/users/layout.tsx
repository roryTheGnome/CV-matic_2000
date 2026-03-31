"use client"

import UserNav from "@/components/navs/UserNav";
import {Suspense} from "react";
import LoadingPage from "@/app/(platform)/users/loading";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <div className="p-6">
            <Suspense fallback={<LoadingPage/>}>
                <UserNav />
                <div>{children}</div>
            </Suspense>
        </div>
    );
}
