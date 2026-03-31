import { SkillItem } from "./SkillItem";
import {SkillMastery} from "@/types/skills";

export const SkillCategorySection = ({
                                         title,
                                         skills,
                                     }: {
    title: string;
    skills: SkillMastery[];
}) => {
    if (!skills.length) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">
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