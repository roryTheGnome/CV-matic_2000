import { levelToColor, levelToBgColor } from "@/types/skills";

type Props = {
    level: 1 | 2 | 3 | 4 | 5;
};

export const SkillBar = ({ level }: Props) => {
    return (
        <div
            className={`h-1.5 w-20 rounded overflow-hidden ${levelToBgColor[level]}`}
        >
            <div
                className={`h-full transition-all ${levelToColor[level]}`}
                style={{ width: `${level * 20}%` }}
            />
        </div>
    );
};