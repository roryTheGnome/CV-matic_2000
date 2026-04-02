import { Button } from "@/components/ui/Button"
import { CancelButton } from "@/components/ui/CancelButton"
import { InputField } from "@/components/ui/inputField/InputField"
import { useSkillActions } from "@/lib/hooks/skillHooks/useSkillActions"
import { SkillModalFormState } from "@/types/skills"
import { SkillSelect } from "../SkillCategorySelect"

export function SkillForm({
  initialData,
  skillId,
}: {
  initialData?: SkillModalFormState
  skillId?: string
}) {
  const {
    formData,
    formId,
    loading: saving,
    isFormValid,
    isDirty,
    type,
    closeModal,
    handleChange,
    handleSubmit,
  } = useSkillActions(initialData, skillId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        inputId={`${formId}-name`}
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <SkillSelect
        formId={formId}
        formData={formData}
        handleChange={handleChange}
      />

      <div className="flex justify-end gap-4 mt-10">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
          {saving
            ? type === "SKILL_CREATE"
              ? "CREATING"
              : "SAVING"
            : type === "SKILL_CREATE"
              ? "CREATE"
              : "SAVE"}
        </Button>
      </div>
    </form>
  )
}
