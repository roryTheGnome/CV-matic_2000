"use client";
import { useEffect, useState } from "react";
import EmployeesList from "@/components/EmployeesList";
import { useUsers } from "@/lib/hooks/useUsers";
import { getAccessToken } from "@/actions/auth";
import { getCurrentUser } from "@/lib/GetCurrent";
import {headers} from "@/constants/tableHeaders";
import SortHeader from "@/components/SortHeader";

export default function Employees() {
    const { users, isLoading, error, search, sortKey, sortDir, setSearch, handleSort } = useUsers();

    const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined);

    useEffect(() => {
        async function fetchToken() {
            const token = await getAccessToken();
            if (token) {
                const currentUser = getCurrentUser(token);
                const id=currentUser?.sub;
                setCurrentUserId(id);
            }
        }
        fetchToken();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-500 rounded-4xl w-full max-w-sm"
            />

            <div className="overflow-x-auto rounded-lg ">
                <table className="min-w-full divide-y divide-gray-500 ">
                    <thead>
                    <tr>
                        {headers.map((header) => (
                            <SortHeader
                                key={header.key}
                                label={header.label}
                                sortKeyValue={header.key}
                                currentSortKey={sortKey}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                        ))}
                    </tr>
                    </thead>

                    <EmployeesList
                        users={users}
                        search={search}
                        sortKey={sortKey}
                        sortDir={sortDir}
                        currentUserId={currentUserId}
                    />
                </table>
            </div>
        </div>
    );
}
