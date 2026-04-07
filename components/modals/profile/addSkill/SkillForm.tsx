"use client";

import { Button } from "@/components/ui/Button";
import { CancelButton } from "@/components/ui/CancelButton";
import { useModalStore } from "@/store/modalStore";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SKILLS } from "@/api/graphql/queries/skills";
import { ADD_PROFILE_SKILL } from "@/api/graphql/mutations/profile";
import { GET_USER } from "@/api/graphql/queries/user";
import { GetSkillsData, Mastery, SkillItem } from "@/types/skills";
import { Select } from "@/components/ui/select/Select";
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser";

type SkillFormProps = {
  userSkills: { name: string }[];
};

export function SkillForm({ userSkills }: SkillFormProps) {
  const { currentUserId } = useCurrentUser();
  const { closeModal } = useModalStore();

  const { data, loading, error } = useQuery<GetSkillsData>(GET_SKILLS);

  const [addSkill, { loading: saving }] = useMutation(ADD_PROFILE_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: currentUserId },
      },
    ],
  });

  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [mastery, setMastery] = useState<Mastery>("Novice");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId || !selectedSkill) return;

    try {
      await addSkill({
        variables: {
          skill: {
            userId: currentUserId,
            name: selectedSkill.name,
            categoryId: selectedSkill.category?.id,
            mastery,
          },
        },
      });

      closeModal();
    } catch (err) {
      console.error("BIG NO NO:", err);
    }
  };

  if (loading) return <div>Loading skills...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const availableSkills =
    data?.skills.filter(
      (skill) => !userSkills.some((u) => u.name === skill.name),
    ) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        id="skill"
        name="skill"
        value={selectedSkill?.name || ""}
        isRequired={true}
        title=" "
        handleChange={(e) => {
          const skill = availableSkills.find((s) => s.name === e.target.value);
          setSelectedSkill(skill || null);
        }}
      >
        {availableSkills.map((skill) => (
          <option key={skill.id} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </Select>

      <Select
        id="mastery"
        name="mastery"
        value={mastery}
        isRequired={true}
        title="Select mastery"
        handleChange={(e) => setMastery(e.target.value as Mastery)}
      >
        <option value="Novice">Novice</option>
        <option value="Advanced">Advanced</option>
        <option value="Competent">Competent</option>
        <option value="Proficient">Proficient</option>
        <option value="Expert">Expert</option>
      </Select>

      <div className="flex justify-end gap-4">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={saving || !selectedSkill}>
          {saving ? "ADDING..." : "ADD"}
        </Button>
      </div>
    </form>
  );
}
