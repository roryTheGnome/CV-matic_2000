import {User} from "@/types/user";
import {useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {Department, GetDepartmentsResponse} from "@/types/department";
import {GET_DEPARTMENTS} from "@/api/graphql/queries/departments";
import {GetPositionsResponse, Position} from "@/types/position";
import {GET_POSITIONS} from "@/api/graphql/queries/positions";
import {UPDATE_PROFILE, UPDATE_USER} from "@/api/graphql/queries/user";

type ProfileProp = {
    user: User
};

export default function EditableProfile({user}:ProfileProp){
    const fullName=`${user.profile.first_name} ${user.profile.last_name}`;

    const [firstName, setFirstName] = useState(user.profile.first_name || "");
    const [lastName, setLastName] = useState(user.profile.last_name || "");

    const [departmentId, setDepartmentId] = useState(user.department?.id || "");
    const [positionId, setPositionId] = useState(user.position?.id || "");

    const [changeSuccess, setChangeSuccess]= useState(false);

    const {data: depData, loading:depLoading}=useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS);
    const {data: posData, loading:posLoading}=useQuery<GetPositionsResponse>(GET_POSITIONS);

    const [updateProfile,{loading: profileLoading}]= useMutation(UPDATE_PROFILE);
    const [updateUser,{loading: userLoading}]= useMutation(UPDATE_USER);

    const loading= profileLoading ||userLoading;

    const handleSave= async ()=>{
        setChangeSuccess(false);

        try{
            await updateProfile({
                variables:{
                    profile:{
                        userId: user.id,
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            });
            await updateUser({
                variables: {
                    user: {
                        userId: user.id,
                        departmentId,
                        positionId
                    }
                }
            });
            setChangeSuccess(true);
        }catch (err) {
            console.error("Upsi! Update failed:", err);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center text-center mb-8">
                <img
                    src={user.profile?.avatar ?? 'https://placehold.co/100'}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />

                <h1 className="text-2xl font-semibold">{fullName}</h1>

                <p className="text-sm text-text-secondary">{user.email}</p>

                <p className="text-sm text-text-secondary">
                    Member since {new Date(user.profile.created_at).toDateString()}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

                <div className="flex flex-col">
                    <label className="text-sm text-text-secondary">
                        First Name
                    </label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 p-3 border rounded bg-surface"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-text-secondary">
                        Last Name
                    </label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 p-3 border rounded bg-surface"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-text-secondary">
                        Department
                    </label>

                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="mt-1 p-3 border rounded bg-surface"
                        disabled={depLoading}
                    >
                        <option value="">Select department</option>

                        {depData?.departments.map((dep: Department) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-text-secondary">
                        Position
                    </label>

                    <select
                        value={positionId}
                        onChange={(e) => setPositionId(e.target.value)}
                        className="mt-1 p-3 border rounded bg-surface"
                        disabled={posLoading}
                    >
                        <option value="">Select position</option>

                        {posData?.positions.map((pos: Position) => (
                            <option key={pos.id} value={pos.id}>
                                {pos.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className={`mt-6 px-4 py-2 rounded text-white ${
                    loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                {loading ? "Saving..." : "Save"}
            </button>

            {changeSuccess && (
                <p className="mt-3 text-green-500 text-sm">
                    Profile updated successfully; pls change me to toast lrt
                </p>
            )}
        </>
    );
}