import {useQuery} from "@apollo/client/react";
import {GetUsersResponse} from "@/types/user";
import { GET_USERS} from "@/lib/queries/user";
import {SortKey} from "@/types/table";
import {useState} from "react";

export function useUsers() {

    const { data, loading, error } = useQuery<GetUsersResponse>(GET_USERS);

    const [search, setSearch] = useState("");

    const [sortKey, setSortKey] = useState<SortKey>("first_name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");


    const handleSort=(key:SortKey)=>{
        if(key==sortKey){
            setSortDir(sortDir==="asc"? "desc":"asc");
        }
        else{
            setSortKey(key);
            setSortDir("asc")
        }
    }

    return {
        users: data?.users ?? [],
        search,
        isLoading: loading,
        sortKey,
        sortDir,
        error,
        handleSort,
        setSearch,
    };
}
