import {Skill, skillsCategory} from "@/types/skills";
import { SkillCategorySection } from "./SkillCategorySection";

export type Props = {
    skills: Skill[];
};

export const Skills = ({ skills }: Props) => {
    const grouped = skillsCategory.map((category) => ({
        ...category,
        skills: skills.filter(
            (s) => s.categoryId === category.id
        ),
    }));

    const uncategorized = skills.filter((s) => !s.categoryId);

    return (
        <div className="space-y-8">
            {grouped.map((category) => (
                <SkillCategorySection
                    key={category.id}
                    title={category.name}
                    skills={category.skills}
                />
            ))}

            {uncategorized.length > 0 && (
                <SkillCategorySection
                    title="Other"
                    skills={uncategorized}
                />
            )}
        </div>
    );
};