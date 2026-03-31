import { masteryToLevel, SkillMastery } from "@/types/skills";
import { SkillBar } from "./SkillBar";

export const SkillItem = ({ skill }: { skill: SkillMastery }) => {
    const level = masteryToLevel[skill.mastery];

    return (
        <div className="flex items-center gap-3 min-w-40">
            <SkillBar level={level} />
            <span className="text-sm text-text-secondary">
        {skill.name}
      </span>
        </div>
    );
};