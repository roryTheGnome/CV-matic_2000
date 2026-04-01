import { SkillMastery, Skill } from "@/types/skills";
import { SkillCategorySection } from "./SkillCategorySection";

export type Props = {
    skills: SkillMastery[];
    allSkills: Skill[];
};

export const Skills = ({ skills, allSkills }: Props) => {

    const grouped: Record<string, SkillMastery[]> = {};

    skills.forEach((skill) => {
        const fullSkill = allSkills.find(s => s.name === skill.name);

        const categoryName = fullSkill?.category_name || "Other"; //i add otehr as fallback but i dont think it will be at use, max for debugging

        if (!grouped[categoryName]) {
            grouped[categoryName] = [];
        }

        grouped[categoryName].push(skill);
    });

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([category, skills]) => (
                <SkillCategorySection
                    key={category}
                    title={category}
                    skills={skills}
                />
            ))}
        </div>
    );
};