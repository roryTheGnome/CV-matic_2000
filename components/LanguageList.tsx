import {LanguageProficiency} from "@/types/lang";
import {useState} from "react";
import {Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {useModalStore} from "@/store/modalStore";

const getTextColor = (level: LanguageProficiency["proficiency"]) => {
    switch (level) {
        case "A1":
            return "var(--color-level-novice)";
        case "A2":
            return "var(--color-level-novice)";
        case "B1":
            return "var(--color-level-advanced)";
        case "B2":
            return "var(--color-level-advanced)";
        case "C1":
            return "var(--color-level-proficient)";
        case "C2":
            return "var(--color-level-proficient)";
        case "Native":
            return "var(--color-level-expert)";
        default:
            return "var(--color-text-primary)";
    }
};


type Props = {
    languages: LanguageProficiency[];
    onDelete?:(names: string[])=> void;
    owner:boolean
};

export const LanguageList = ({ languages,onDelete, owner }: Props) => {

    const { openModal } = useModalStore();

    const [deleteMode,setDeleteMode]=useState(false);
    const [selected, setSelected] =useState<string[]>([]);

    const toggleSelect = (name: string) => {
        if (!deleteMode) return;

        setSelected((prev)=> prev.includes(name) ?
            prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const handleDelete = () => {
        if (!deleteMode) {
            setDeleteMode(true);
            return;
        }

        if (selected.length===0) return;

        onDelete?.(selected);

        setSelected([]);
        setDeleteMode(false);
    };

    return (
        <div >
            <div className="flex flex-wrap gap-30 pl-30 pr-30">
                {languages.map((lang) => (
                    <div
                        key={lang.name}
                        onClick={()=>toggleSelect(lang.name)}
                        className="flex items-center gap-5  p-4 rounded-xl hover:bg-[#1a1a1a]"
                    >
                    <span className="text-white font-medium ">
                        {lang.name}
                    </span>

                        <span
                            className="px-3 py-1 rounded-md font-bold text-2xl"
                            style={{
                                color: getTextColor(lang.proficiency),
                            }}
                        >
                        {lang.proficiency}
                    </span>
                    </div>
                ))}
            </div>

            {owner&&(
                <div className="flex justify-end gap-4 ">
                    {deleteMode ?(
                        <>
                            <Button
                                isTextButton
                                className="flex items-center justify-center cursor-pointer duration-300 disabled:bg-surface-disabled disabled:text-text-primary/40 uppercase p-3  bg-transparent rounded-full w-full max-w-57 hover:brightness-110 border border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary"
                                onClick={() => {
                                    setDeleteMode(false);
                                    setSelected([]);
                                }}
                            >
                                CANCEL
                            </Button>
                            <Button
                                isTextButton
                                className={`flex items-center justify-center cursor-pointer duration-300 uppercase p-3 rounded-full w-full max-w-57 border
                                 ${selected.length > 0
                                    ? "bg-primary text-text-primary border-primary hover:brightness-110"
                                    : "bg-transparent border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary"}
                                  disabled:bg-surface-disabled disabled:text-text-primary/40
                                `}
                                onClick={handleDelete}
                            >
                                CONFIRM ({selected.length})
                            </Button>
                        </>

                    ):(
                        <>
                            <Button
                                Icon={Plus}
                                isTextButton
                                className="text-gray-400"
                                onClick={() => openModal("PROFILE_LANGUAGE_ADD")}
                            >
                                ADD LANGUAGE
                            </Button>
                            <Button
                                Icon={Trash2 }
                                isTextButton
                                className="text-red-400"
                                onClick={handleDelete}
                            >
                                REMOVE LANGUAGES
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

