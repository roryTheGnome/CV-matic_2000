export type Mastery =
    | "Novice"
    | "Advanced"
    | "Competent"
    | "Proficient"
    | "Expert";


export type SkillCategory = {
  id: string;
  name: string;
  order: number;
  parent?: SkillCategory;
  children: SkillCategory[];
};


export type Skill = {
  id: string;
  created_at: string;
  name: string;
  category?: SkillCategory;
  category_name?: string;
  category_parent_name?: string;
};


export type SkillMastery = {
  name: string;
  categoryId?: string;
  mastery: Mastery;
};



export type AddProfileSkillInput = {
  userId: string;
  name: string;
  categoryId?: string;
  mastery: Mastery;
};

export type UpdateProfileSkillInput = {
  userId: string;
  name: string;
  categoryId?: string;
  mastery: Mastery;
};

export type DeleteProfileSkillInput = {
  userId: string;
  name: string[];
};


export type GetSkillsData = {
  skills: Skill[];
};

export type GetSkillCategoriesData = {
  skillCategories: SkillCategory[];
};


export const masteryToLevel: Record<Mastery, number> = {
  Novice: 1,
  Advanced: 2,
  Competent: 3,
  Proficient: 4,
  Expert: 5,
};

export const levelToColor: Record<number, string> = {
  1: "bg-[var(--color-level-novice)]",
  2: "bg-[var(--color-level-advanced)]",
  3: "bg-[var(--color-level-competent)]",
  4: "bg-[var(--color-level-proficient)]",
  5: "bg-[var(--color-level-expert)]",
};

export const levelToBgColor: Record<number, string> = {
  1: "bg-[var(--level-novice-dark)]",
  2: "bg-[var(--level-advanced-dark)]",
  3: "bg-[var(--level-competent-dark)]",
  4: "bg-[var(--level-proficient-dark)]",
  5: "bg-[var(--level-expert-dark)]",
};