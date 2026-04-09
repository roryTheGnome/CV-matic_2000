import { useEditableProfile } from '@/lib/hooks/userHooks/useEditableProfile'
import { Department } from '@/types/department'
import { Position } from '@/types/position'
import { User } from '@/types/user'
import Image from 'next/image'
import defaultProfile from '../../public/default-profile.png'
import { Button } from '../ui/Button'
import { InputField } from '../ui/inputField/InputField'
import { Option } from '../ui/select/Option'
import { Select } from '../ui/select/Select'

type ProfileProp = {
  user: User
}

export default function EditableProfile({ user }: ProfileProp) {
  const {
    firstName,
    lastName,
    departmentId,
    positionId,
    depData,
    depLoading,
    posData,
    posLoading,
    loading,
    preview,
    hasUnsavedChanges,
    handleAvatarChange,
    handleDeleteAvatar,
    handleSave,
    setFirstName,
    setLastName,
    setDepartmentId,
    setPositionId,
  } = useEditableProfile(user)

  return (
    <>
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="group relative">
            <Image
              src={preview ?? defaultProfile}
              className="bg-surface h-32 w-32 rounded-full object-cover"
              alt="Preview avatar"
              width={128}
              height={128}
              loading="eager"
            />

            <label className="bg-background/60 text-text-primary absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full px-2 text-center text-xs opacity-0 transition group-hover:opacity-100">
              <span className="font-medium">Upload avatar image</span>
              <span className="mt-1 text-[10px] opacity-80">
                png, jpg or gif (max 0.5MB)
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {preview && (
            <button
              onClick={handleDeleteAvatar}
              className="text-text-secondary hover:text-primary mt-3 text-sm transition"
            >
              Remove avatar
            </button>
          )}
        </div>
        <p className="text-text-secondary text-sm">{user.email}</p>

        <p className="text-text-secondary text-sm">
          A member since{' '}
          {new Date(Number(user.profile.created_at)).toDateString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InputField
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          inputId="first_name"
          label="First Name"
          name="first_name"
          maxLength={50}
        />
        <InputField
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          inputId="last_name"
          label="Last Name"
          name="last_name"
          maxLength={50}
        />

        <Select
          lable="Department"
          title={user.department_name}
          value={departmentId}
          disabled={depLoading}
          handleChange={(e) => setDepartmentId(e.target.value)}
          id="department"
          isRequired={false}
          name="department"
        >
          {depData?.departments.map((dep: Department) => (
            <Option title={dep.name} key={dep.id} value={dep.id} />
          ))}
        </Select>

        <Select
          lable="Position"
          title={user.position_name} // Select position
          value={positionId}
          disabled={posLoading}
          handleChange={(e) => setPositionId(e.target.value)}
          id="department"
          isRequired={false}
          name="department"
        >
          {posData?.positions.map((pos: Position) => (
            <Option title={pos.name} key={pos.id} value={pos.id} />
          ))}
        </Select>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading || !hasUnsavedChanges}
        className={`mt-6`}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </>
  )
}
