import { SkillItem } from "./SkillItem";
import {SkillMastery} from "@/types/skills";

export const SkillCategorySection = ({
                                         title,
                                         skills,
                                         deleteMode,
                                         selected,
                                         onSelect,
                                     }: {
    title: string;
    skills: SkillMastery[];
    deleteMode: boolean;
    selected: string[];
    onSelect: (name: string) => void;
}) => {

    if (!skills.length) return null;

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="text-sm text-text-primary">
                {title}
            </h3>

            <div className="flex flex-wrap gap-x-10 gap-y-4">
                {skills.map((skill) => (
                    <SkillItem
                        key={skill.name}
                        skill={skill}
                        deleteMode={deleteMode}
                        isSelected={selected.includes(skill.name)}
                        onClick={() => onSelect(skill.name)}
                    />
                ))}
            </div>
        </div>
    );
};