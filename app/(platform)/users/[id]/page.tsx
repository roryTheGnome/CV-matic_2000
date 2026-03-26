"use client";

import { useUser } from "@/lib/hooks/useUser";

export default function Employee(){

    const{user}=useUser();
    if(!user)return<div>user not found!!</div> //TODO add not found & loading

    /* when api added :
    if (isLoading) return <Loading />
    if (error) return <ErrorState />
    if (!user) return <NotFound />

    return <UserContent />
     */

    const fullName =`${user.profile.first_name} ${user.profile.last_name}`;

    return(
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
                <img
                    src={user.profile?.avatar ?? 'https://placehold.co/40'}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />

                <h1 className="text-2xl font-semibold">{fullName}</h1>

                <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>

                <p className="text-sm text-[var(--color-text-secondary)]">
                    A member since {new Date(user.profile.created_at).toDateString()}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">
                        First Name
                    </label>
                    <div className="mt-1 p-3 border rounded bg-[var(--color-surface)]">
                        {user.profile.first_name}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">
                        Last Name
                    </label>
                    <div className="mt-1 p-3 border rounded bg-[var(--color-surface)]">
                        {user.profile.last_name}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">
                        Department
                    </label>
                    <div className="mt-1 p-3 border rounded bg-[var(--color-surface)]">
                        {user.department}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">
                        Position
                    </label>
                    <div className="mt-1 p-3 border rounded bg-[var(--color-surface)]">
                        {user.position}
                    </div>
                </div>
            </div>
        </div>
    )
}