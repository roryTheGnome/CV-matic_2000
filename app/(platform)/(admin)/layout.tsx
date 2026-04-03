'use client'

//import {Suspense} from "react";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-6">
      {/*<Suspense fallback={<LoadingPage/>}>*/}
      {/*    <Nav />*/}
      {/*    <div>{children}</div>*/}
      {/*</Suspense>*/}
      <div>{children}</div>
    </div>
  )
}
