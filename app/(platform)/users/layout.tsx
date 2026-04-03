"use client"

import {Suspense} from "react";
import LoadingPage from "@/app/(platform)/loading";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <div >
            <Suspense fallback={<LoadingPage/>}>
                <div>{children}</div>
            </Suspense>
        </div>
    );
}
