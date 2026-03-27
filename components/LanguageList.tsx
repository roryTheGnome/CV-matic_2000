import { Language } from "@/types/lang";

const getTextColor = (level: Language["proficiency"]) => {
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
    languages: Language[];
};

export const LanguageList = ({ languages }: Props) => {
    return (
        <div className="flex flex-wrap gap-30 pl-30 pr-30">
            {languages.map((lang) => (
                <div
                    key={lang.id}
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
    );
};

