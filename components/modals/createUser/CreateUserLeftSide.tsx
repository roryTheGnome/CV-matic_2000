import { InputField } from "@/components/ui/inputField/InputField"
import { Option } from "@/components/ui/select/Option"
import { Select } from "@/components/ui/select/Select"

import { CreateUserModalFormState } from "@/types/user"
import { ChangeEvent } from "react"
import { DepartmentsSelect } from "./DepartmentsSelect"

export interface CreateUserProps {
  formId: string
  formData: CreateUserModalFormState
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}
export function CreateUserLeftSide({
  formData,
  formId,
  handleChange,
}: CreateUserProps) {
  return (
    <div className="flex flex-col gap-8">
      <InputField
        inputId={`${formId}-email`}
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputField
        inputId={`${formId}-firstName`}
        label="First Name"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <DepartmentsSelect
        formId={formId}
        formData={formData}
        handleChange={handleChange}
      />

      <Select
        id={`${formId}-role`}
        name="role"
        value={formData.role}
        isRequired
        title="Role"
        handleChange={handleChange}
      >
        <Option value="Employee" title="Employee" />
        <Option value="Admin" title="Admin" />
      </Select>
    </div>
  )
}
