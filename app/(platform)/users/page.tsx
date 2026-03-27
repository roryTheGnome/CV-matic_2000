"use client";
import SortHeader from "@/components/SortHeader"
import EmployeesList from "@/components/EmployeesList";
import {useUsers} from "@/lib/hooks/useUsers";
import {headers} from "@/constants/tableHeaders";


export default function Employees(){
    const { users, isLoading, error, search, sortKey, sortDir, setSearch, handleSort } = useUsers();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;

    return(
        <div>
            <input
                type="text"
                placeholder="Search.."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
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
                    />

                </table>
            </div>
        </div>
    )
}