import { SkillMastery } from "@/types/skills";
import { SkillCategorySection } from "./SkillCategorySection";

export type Props = {
    skills: SkillMastery[];
};

export const Skills = ({ skills }: Props) => {

    const grouped: Record<string, SkillMastery[]> = {};

    skills.forEach((skill) => {
        const key = skill.categoryId || "Other";

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(skill);
    });

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([categoryId, skills]) => (
                <SkillCategorySection
                    key={categoryId}
                    title={categoryId === "Other" ? "Other" : categoryId}
                    skills={skills}
                />
            ))}
        </div>
    );
};