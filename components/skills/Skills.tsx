import { Button } from "@/components/ui/Button";
import { useModalStore } from "@/store/modalStore";
import { SkillItem, SkillMastery } from "@/types/skills";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SkillCategorySection } from "./SkillCategorySection";

export type Props = {
  skills: SkillMastery[];
  allSkills: SkillItem[];
  onDelete?: (names: string[]) => void;
  owner: boolean;
};

export const Skills = ({ skills, allSkills, onDelete, owner }: Props) => {
  const { openModal } = useModalStore();

  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const grouped: Record<string, SkillMastery[]> = {};

  const toggleSelect = (name: string) => {
    if (!deleteMode) return;

    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleDelete = () => {
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    if (selected.length === 0) return;

    onDelete?.(selected);

    setSelected([]);
    setDeleteMode(false);
  };

  skills.forEach((skill) => {
    const fullSkill = allSkills.find((s) => s.name === skill.name);

    const categoryName = fullSkill?.category_name || "Other"; //i add otehr as fallback but i dont think it will be at use, max for debugging

    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }

    grouped[categoryName].push(skill);
  });

  return (
    <div>
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, skills]) => (
          <SkillCategorySection
            key={category}
            title={category}
            skills={skills}
            deleteMode={deleteMode}
            selected={selected}
            onSelect={toggleSelect}
          />
        ))}
      </div>

      {owner && (
        <div className="flex justify-end gap-4 ">
          {deleteMode ? (
            <>
              <Button
                isTextButton
                className="flex items-center justify-center cursor-pointer duration-300 disabled:bg-surface-disabled disabled:text-text-primary/40 uppercase p-3  bg-transparent rounded-full w-full max-w-57 hover:brightness-110 border border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary"
                onClick={() => {
                  setDeleteMode(false);
                  setSelected([]);
                }}
              >
                CANCEL
              </Button>
              <Button
                isTextButton
                className={`flex items-center justify-center cursor-pointer duration-300 uppercase p-3 rounded-full w-full max-w-57 border
                                 ${
                                   selected.length > 0
                                     ? "bg-primary text-text-primary border-primary hover:brightness-110"
                                     : "bg-transparent border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary"
                                 }
                                  disabled:bg-surface-disabled disabled:text-text-primary/40
                                `}
                onClick={handleDelete}
              >
                CONFIRM ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                Icon={Plus}
                isTextButton
                className="text-gray-400"
                onClick={() => openModal("PROFILE_SKILL_ADD")}
              >
                ADD SKILLS
              </Button>
              <Button
                Icon={Trash2}
                isTextButton
                className="text-red-400"
                onClick={handleDelete}
              >
                REMOVE SKILLS
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
