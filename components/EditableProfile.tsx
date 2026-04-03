import { useEditableProfile } from "@/lib/hooks/userHooks/useEditableProfile"
import { Department } from "@/types/department"
import { Position } from "@/types/position"
import { User } from "@/types/user"
import Image from "next/image"
import defaultProfile from "../public/default-profile.png"
import { Button } from "./ui/Button"
import { InputField } from "./ui/inputField/InputField"
import { Option } from "./ui/select/Option"
import { Select } from "./ui/select/Select"

type ProfileProp = {
  user: User
}

export default function EditableProfile({ user }: ProfileProp) {
  const {
    firstName,
    lastName,
    departmentId,
    positionId,
    fullName,
    depData,
    depLoading,
    posData,
    posLoading,
    loading,
    handleSave,
    setFirstName,
    setLastName,
    setDepartmentId,
    setPositionId,
  } = useEditableProfile(user)

  return (
    <>
      <div className="flex flex-col items-center text-center mb-8">
        <Image
          src={user.profile.avatar || defaultProfile}
          alt={`${user.profile.first_name} ${user.profile.last_name}'s avatar`}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />

        <h1 className="text-2xl font-semibold">{fullName}</h1>

        <p className="text-sm text-text-secondary">{user.email}</p>

        <p className="text-sm text-text-secondary">
          Member since {new Date(user.profile.created_at).toDateString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InputField
          inputId="first_name"
          label="First Name"
          name="first_name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />

        <InputField
          inputId="last_name"
          label="Last Name"
          name="last_name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />

        <Select
          id={departmentId}
          title="Department"
          handleChange={e => setDepartmentId(e.target.value)}
          isRequired={false}
          name="department"
          value={departmentId}
          disabled={depLoading}
        >
          {depData?.departments.map((dep: Department) => (
            <Option key={dep.id} value={dep.id} title={dep.name} />
          ))}
        </Select>

        <Select
          id={positionId}
          title="Position"
          handleChange={e => setPositionId(e.target.value)}
          isRequired={false}
          name="position"
          value={positionId}
          disabled={posLoading}
        >
          {posData?.positions.map((pos: Position) => (
            <Option key={pos.id} value={pos.id} title={pos.name} />
          ))}
        </Select>
      </div>

      <Button onClick={handleSave} disabled={loading} className="mt-6">
        {loading ? "Saving..." : "Save"}
      </Button>
    </>
  )
}
