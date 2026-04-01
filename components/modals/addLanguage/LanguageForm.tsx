"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";
import { CancelButton } from "@/components/ui/CancelButton";
import { useModalStore } from "@/store/modalStore";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GetLanguagesData, Proficiency } from "@/types/lang";
import {GET_LANGUAGES} from "@/api/graphql/queries/language";
import {PROFILE_LANGUAGE_ADD} from "@/api/graphql/mutations/profile";

type LanguageFormProps={
    userLanguages: { name: string }[];
}

export function LanguageForm({userLanguages}:LanguageFormProps) {
    const { currentUserId } = useCurrentUser();
    const { closeModal } = useModalStore();

    const { data, loading, error } = useQuery<GetLanguagesData>(GET_LANGUAGES);

    const [addLanguage, { loading: saving }] = useMutation(PROFILE_LANGUAGE_ADD);

    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [proficiency, setProficiency] = useState<Proficiency>("A1");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUserId || !selectedLanguage) return;

        try {
            await addLanguage({
                variables: {
                    language: {
                        userId: currentUserId,
                        name: selectedLanguage,
                        proficiency,
                    },
                },
            });

            closeModal();
        } catch (err) {
            console.error("ERROR:", err);
        }
    };

    if (loading) return <div>Loading languages...</div>; //TODO change these latr
    if (error) return <div>Error: {error.message}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <select
                className="w-full p-2 bg-gray-800 rounded"   //TODO change select to MultiSelectField
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                required
            >
                <option value="">Select language</option>

                {data?.languages
                    .filter(
                        (lang) =>
                            !userLanguages.some(
                                (userLang) => userLang.name === lang.name
                            )
                    )
                    .map((lang) => (
                        <option key={lang.id} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
            </select>

            <select
                className="w-full p-2 bg-gray-800 rounded"  //TODO change select to MultiSelectField
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as Proficiency)}
            >
                {/*TODO map this instead of hard coding later*/}
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="Native">Native</option>
            </select>

            <div className="flex justify-end gap-4">
                <CancelButton closeModal={closeModal} />
                <Button type="submit" disabled={saving || !selectedLanguage}>
                    {saving ? "ADDING..." : "ADD"}
                </Button>
            </div>
        </form>
    );
}