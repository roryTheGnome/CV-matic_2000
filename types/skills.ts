export type Skill = {
    name: string;
    categoryId?: string;
    mastery: 'Novice'| 'Advanced' | 'Competent' | 'Proficient' | 'Expert' ;
};

export const masteryToLevel = {
    Novice: 1,
    Advanced: 2,
    Competent: 3,
    Proficient: 4,
    Expert: 5,
} as const;

export const levelToColor = {
    1: "bg-[var(--color-level-novice)]",
    2: "bg-[var(--color-level-advanced)]",
    3: "bg-[var(--color-level-competent)]",
    4: "bg-[var(--color-level-proficient)]",
    5: "bg-[var(--color-level-expert)]",
};
export const levelToBgColor = {
    1: "bg-[var(--level-novice-dark)]",
    2: "bg-[var(--level-advanced-dark)]",
    3: "bg-[var(--level-competent-dark)]",
    4: "bg-[var(--level-proficient-dark)]",
    5: "bg-[var(--level-expert-dark)]",
};

export const skillsCategory = [
    { id: "1", name: "Programming languages" },
    { id: "2", name: "Frontend" },
    { id: "3", name: "Backend" },
    { id: "4", name: "Testing frameworks and tools" },
    { id: "5", name: "DevOps" },
    { id: "6", name: "Source control systems" },
];

