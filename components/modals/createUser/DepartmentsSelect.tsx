import { GET_DEPARTMENTS } from "@/api/graphql/queries/departments"
import { Option } from "@/components/ui/select/Option"
import { Select } from "@/components/ui/select/Select"
import { GetDepartmentsResponse } from "@/types/department"
import { useLazyQuery } from "@apollo/client/react"
import { CreateUserProps } from "./CreateUserLeftSide"

export function DepartmentsSelect({
  formData,
  formId,
  handleChange,
}: CreateUserProps) {
  const [
    getDepartments,
    {
      data: departmentsData,
      loading: departmentsLoading,
      called: departmentsCalled,
    },
  ] = useLazyQuery<GetDepartmentsResponse>(GET_DEPARTMENTS)

  const handleDepartmentsFocus = () => {
    if (!departmentsCalled) {
      getDepartments()
    }
  }
  return (
    <Select
      id={`${formId}-department`}
      name="departmentId"
      value={formData.departmentId}
      isRequired
      title="Department"
      handleChange={handleChange}
      onFocus={handleDepartmentsFocus}
    >
      {departmentsLoading && (
        <Option value="loading" title="Loading..." disabled />
      )}

      {!departmentsData && formData?.departmentName && (
        <Option value={formData.departmentId} title={formData.departmentName} />
      )}

      {departmentsData?.departments.map(department => (
        <Option
          key={department.id}
          value={department.id}
          title={department.name}
        />
      ))}
    </Select>
  )
}
