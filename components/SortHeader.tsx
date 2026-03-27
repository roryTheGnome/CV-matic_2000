import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";
import {SortKey} from "@/types/table";

export default function SortHeader({label, sortKeyValue, currentSortKey, sortDir, onSort,
                    }: {
    label: string;
    sortKeyValue: SortKey;
    currentSortKey: SortKey;
    sortDir: "asc" | "desc";
    onSort: (key: SortKey) => void;
}) {
    const isActive =currentSortKey===sortKeyValue;

    return (
        <th
            onClick={() => onSort(sortKeyValue)}
            className="px-4 py-2 text-left cursor-pointer select-none"
        >
            <div className="flex items-center gap-1">
                {label}

                {isActive ? (
                    sortDir === "asc" ? (
                        <ArrowUp size={16} />
                    ):(
                        <ArrowDown size={16} />
                    )
                ):(
                    <ArrowUpDown size={16} className="opacity-40" />
                )}
            </div>
        </th>
    );
}