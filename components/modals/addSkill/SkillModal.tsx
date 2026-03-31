"use client";

import { SkillForm } from "./SkillForm";
import {ModalLayout} from "@/components/modals/ModalLayout";

export function SkillModal() {
    return (
        <ModalLayout title="Add Skill">
            <SkillForm />
        </ModalLayout>
    );
}