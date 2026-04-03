"use client";

import { CvModal } from "@/components/modals/cvModal/CvModal";
import { DepartmentModal } from "@/components/modals/departmentModal/DepartmentModal";
import { ProjectModal } from "@/components/modals/projectModal/ProjectModal";
import { UserModal } from "@/components/modals/userModal/UserModal";

import { DeleteCvModal } from "@/components/modals/cvModal/DeleteCvModal";
import { DeleteDepartmentModal } from "@/components/modals/departmentModal/DeleteDepartmentModal";
import { DeleteLanguageModal } from "@/components/modals/languageModal/DeleteLanguageModal";
import { LanguageModal } from "@/components/modals/languageModal/LanguageModal";
import { DeletePositionModal } from "@/components/modals/positionModal/DeletePositionModal";
import { PositionModal } from "@/components/modals/positionModal/PositionModal";
import { DeleteProjectModal } from "@/components/modals/projectModal/DeleteProjectModal";
import { DeleteSkillModal } from "@/components/modals/skillModal/DeleteSkillModal";
import { SkillModal } from "@/components/modals/skillModal/SkillModal";
import { DeleteUserModal } from "@/components/modals/userModal/DeleteUserModal";
import { useModalStore } from "@/store/modalStore";
import { ProfileSkillModal } from "@/components/modals/addSkill/SkillModal";
import { ProfileLanguageModal } from "@/components/modals/addLanguage/LanguageModal";

export function ModalProvider() {
  const { type, isOpen } = useModalStore();

  if (!isOpen) return null;

  return (
    <>
      {type === "USER_DELETE" && <DeleteUserModal />}
      {type === "USER_CREATE" && <UserModal />}
      {type === "USER_EDIT" && <UserModal />}

      {type === "PROJECT_DELETE" && <DeleteProjectModal />}
      {type === "PROJECT_CREATE" && <ProjectModal />}
      {type === "PROJECT_EDIT" && <ProjectModal />}

      {type === "CV_DELETE" && <DeleteCvModal />}
      {type === "CV_CREATE" && <CvModal />}
      {type === "CV_EDIT" && <CvModal />}

      {type === "DEPARTMENT_DELETE" && <DeleteDepartmentModal />}
      {type === "DEPARTMENT_CREATE" && <DepartmentModal />}
      {type === "DEPARTMENT_EDIT" && <DepartmentModal />}

      {type === "POSITION_DELETE" && <DeletePositionModal />}
      {type === "POSITION_CREATE" && <PositionModal />}
      {type === "POSITION_EDIT" && <PositionModal />}

      {type === "SKILL_DELETE" && <DeleteSkillModal />}
      {type === "SKILL_CREATE" && <SkillModal />}
      {type === "SKILL_EDIT" && <SkillModal />}

      {type === "LANGUAGE_DELETE" && <DeleteLanguageModal />}
      {type === "LANGUAGE_CREATE" && <LanguageModal />}
      {type === "LANGUAGE_EDIT" && <LanguageModal />}

      {type === "PROFILE_SKILL_ADD" && <ProfileSkillModal />}
      {type === "PROFILE_LANGUAGE_ADD" && <ProfileLanguageModal />}
    </>
  );
}
