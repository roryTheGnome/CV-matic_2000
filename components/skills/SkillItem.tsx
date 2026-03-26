import {masteryToLevel, Skill} from "@/types/skills";
import { SkillBar } from "./SkillBar";

export const SkillItem = ({ skill }: { skill: Skill }) => {
    const level = masteryToLevel[skill.mastery];

    return (
        <div className="flex items-center gap-3 min-w-[160px]">
            <SkillBar level={level} />
            <span className="text-sm text-[var(--color-text-secondary)]">
        {skill.name}
      </span>
        </div>
    );
};