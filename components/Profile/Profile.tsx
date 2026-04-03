import {User} from "@/types/user";

type ProfileProp = {
    user: User
};

export default function Profile({user}:ProfileProp){
    const fullName=`${user.profile.first_name} ${user.profile.last_name}`

    return(
        <>
            <div className="flex flex-col items-center text-center mb-8">
                <img
                    src={user.profile?.avatar ?? 'https://placehold.co/40'}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />

                <h1 className="text-2xl font-semibold">{fullName}</h1>

                <p className="text-sm text-text-secondary">{user.email}</p>

                <p className="text-sm text-text-secondary">
                    A member since {new Date(Number(user.profile.created_at)).toDateString()}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="text-sm text-text-secondary">
                        First Name
                    </label>
                    <div className="mt-1 p-3 border rounded bg-surface">
                        {user.profile.first_name}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-text-secondary">
                        Last Name
                    </label>
                    <div className="mt-1 p-3 border rounded bg-surface">
                        {user.profile.last_name}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-text-secondary">
                        Department
                    </label>
                    <div className="mt-1 p-3 border rounded bg-surface">
                        {user.department_name}
                    </div>
                </div>
                <div>
                    <label className="text-sm text-text-secondary">
                        Position
                    </label>
                    <div className="mt-1 p-3 border rounded bg-surface">
                        {user.position_name}
                    </div>
                </div>
            </div>
        </>
    )
}