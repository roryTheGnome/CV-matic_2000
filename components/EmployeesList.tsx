import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {User} from "@/types/user";

type EmployeesListProps = {
    users: User[] | [];
    search: string;
    sortKey: "first_name"| "last_name" | "email" | "department" | "position";
    sortDir: "asc" | "desc";
};

export default function EmployeesList({users, search,sortKey, sortDir}:EmployeesListProps){
    const checkedUsers= [...users]
        .filter((u:User)=>{
            const fullname=`${u.profile.first_name} ${u.profile.last_name}`.toLowerCase();
            return fullname.includes(search.toLowerCase());
        })
        .sort((x:User,y:User)=>{
            let valX="";
            let valY="";

            switch (sortKey){
                case "first_name":
                    valY=y.profile.first_name;
                    valX=x.profile.first_name;
                    break;
                case "last_name":
                    valY=y.profile.last_name;
                    valX=x.profile.last_name;
                    break;
                case "email":
                    valY=y.email;
                    valX=x.email;
                    break;
                case "department":
                    valY=y.department_name;
                    valX=x.department_name;
                    break;
                case "position":
                    valY=y.position_name;
                    valX=x.position_name;
                    break;
            }

            if(valX<valY) return sortDir==="asc"? -1 : 1;
            if(valX>valY) return sortDir==="asc"? 1 : -1;
            return 0;
        });
    return(
        <tbody>

        {checkedUsers.map((user)=>(
            <tr key={user.id} className="divide-y divide-gray-500 ">
                <td className="px-4 py-3 flex items-center gap-3">
                    {user.profile.avatar ?(
                        <img
                            src={user.profile.avatar}
                            alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
                            className="w-10 h-10 rounded-full"
                        />
                    ):(
                        <img
                            src={"https://placehold.co/40"}
                            alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    {user.profile.first_name}
                </td>

                <td className="px-4 py-3">{user.profile.last_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.department_name}</td>
                <td className="px-4 py-3">{user.position_name}</td>

                <td className="w-8 text-right pr-2">
                    <Link
                        href={`/users/${user.id}`}
                        className="text-text-secondary hover:text-primary">
                        <ChevronRight size={32} />
                    </Link>
                </td>

                <td className="last:border-b last:border-gray-500"></td>
            </tr>
        ))}

        </tbody>
    )
}