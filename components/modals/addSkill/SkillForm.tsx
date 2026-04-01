"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";
import { CancelButton } from "@/components/ui/CancelButton";
import { useModalStore } from "@/store/modalStore";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_SKILLS} from "@/api/graphql/queries/skills";
import {ADD_PROFILE_SKILL} from "@/api/graphql/mutations/profile";

import { GetSkillsData, Mastery } from "@/types/skills";
import {GET_USER} from "@/api/graphql/queries/user";

type SkillFormProps={
    userSkills: { name: string }[];
}

export function SkillForm({userSkills}:SkillFormProps) {
    const { currentUserId } = useCurrentUser();
    const { closeModal } = useModalStore();

    const { data, loading, error } = useQuery<GetSkillsData>(GET_SKILLS);

    const [addSkill, { loading: saving }] = useMutation(ADD_PROFILE_SKILL,{
        refetchQueries: [
            {
                query: GET_USER,
                variables: { userId: currentUserId },
            },
        ],
    });

    const [selectedSkill, setSelectedSkill] = useState<{
        name: string;
        categoryId?: string;
    } | null>(null);
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
                        categoryId: selectedSkill.categoryId,
                        mastery,
                    },
                },
            });

            closeModal();
        } catch (err) {
            console.error("BIG NO NO:", err);
        }
    };

    if (loading) return <div>Loading skills...</div>; //TODO change these latr
    if (error) return <div>Error: {error.message}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <select
                 className="w-full p-2 bg-gray-800 rounded"  //TODO change select to MultiSelectField
                value={selectedSkill?.name || ""}
                onChange={(e) => {
                    const skill = data?.skills.find(s => s.name === e.target.value);
                    setSelectedSkill(skill || null);
                }}
                required
            >
                <option value="">Select skill</option>

                {data?.skills
                    .filter(
                        (skill)=>
                            !userSkills.some(
                                (userSkill)=>userSkill.name=== skill.name
                            )
                    )
                    .map((skill) => (
                    <option key={skill.id} value={skill.name}>
                        {skill.name}
                    </option>
                ))}
            </select>

            <select
                className="w-full p-2 bg-gray-800 rounded" //TODO change select to MultiSelectField
                value={mastery}
                onChange={(e) => setMastery(e.target.value as Mastery)}
            >
                <option value="Novice">Novice</option>
                <option value="Advanced">Advanced</option>
                <option value="Competent">Competent</option>
                <option value="Proficient">Proficient</option>
                <option value="Expert">Expert</option>
            </select>

            <div className="flex justify-end gap-4">
                <CancelButton closeModal={closeModal} />
                <Button type="submit" disabled={saving || !selectedSkill}>
                    {saving ? "ADDING..." : "ADD"}
                </Button>
            </div>
        </form>
    );
}