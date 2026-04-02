"use client";
import EmployeesList from "@/components/EmployeesList";
import { useUsers } from "@/lib/hooks/useUsers";
import {headers} from "@/constants/tableHeaders";
import SortHeader from "@/components/SortHeader";
import {useCurrentUser} from "@/lib/hooks/useCurrentUser";
import NotFoundPage from "@/app/(platform)/not-found";
import LoadingPage from "@/app/(platform)/loading";

export default function Employees() {
    const { users, error, search, sortKey, sortDir, setSearch, handleSort, isLoading } = useUsers();

    const {currentUserId}=useCurrentUser();

    if (error) return <NotFoundPage/>;

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
          {isLoading ?(<LoadingPage/>):
              (<table className="min-w-full divide-y divide-gray-500 ">
              <thead>
              <tr>
                  {headers.map(header => (
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
          </table>)}
            </div>
        </div>
    );
}
