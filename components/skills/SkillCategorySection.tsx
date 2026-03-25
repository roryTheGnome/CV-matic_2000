import { SkillItem } from "./SkillItem";
import {Skill} from "@/types/skills";

export const SkillCategorySection = ({
                                         title,
                                         skills,
                                     }: {
    title: string;
    skills: Skill[];
}) => {
    if (!skills.length) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {title}
            </h3>

            <div className="flex flex-wrap gap-x-10 gap-y-4">
                {skills.map((skill) => (
                    <SkillItem key={skill.name} skill={skill} />
                ))}
            </div>
        </div>
    );
};