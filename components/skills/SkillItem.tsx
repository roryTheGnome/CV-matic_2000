import {masteryToLevel, SkillMastery} from "@/types/skills";
import { SkillBar } from "./SkillBar";

type SkillItemProps={
    skill: SkillMastery;
    deleteMode: boolean;
    isSelected: boolean;
    onClick: () => void;
}

export const SkillItem = ({ skill,deleteMode,isSelected,onClick }: SkillItemProps) => {
    const level = masteryToLevel[skill.mastery];

    return (
        <div className={`flex items-center gap-3 min-w-40 cursor-pointer rounded px-2 py-1 transition
            ${deleteMode ? "hover:bg-primary/20" : ""}
            ${isSelected ? "bg-primary/40" : ""}
            `}
            onClick={onClick}>
            <SkillBar level={level} />
            <span className="text-sm text-text-secondary">
        {skill.name}
      </span>
        </div>
    );
};