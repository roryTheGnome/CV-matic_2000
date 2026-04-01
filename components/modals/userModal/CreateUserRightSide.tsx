import { InputField } from "@/components/ui/inputField/InputField"
import { PositionsSelect } from "../PositionsSelect"
import { CreateUserProps } from "./CreateUserLeftSide"

export function CreateUserRightSide({
  formId,
  formData,
  handleChange,
}: CreateUserProps) {
  return (
    <div className="flex flex-col gap-8">
      <InputField
        inputId={`${formId}-password`}
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <InputField
        inputId={`${formId}-lastName`}
        label="Last Name"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />

      <PositionsSelect
        formId={formId}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  )
}
