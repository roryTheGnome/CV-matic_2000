import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { CreateUserProps } from '@/components/modals/userModal/CreateUserLeftSide'
import { Option } from '@/components/ui/select/Option'
import { Select } from '@/components/ui/select/Select'
import { useModalStore } from '@/store/modalStore'
import { GetDepartmentsResponse } from '@/types/department'
import { useLazyQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'

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
  const { type } = useModalStore()

  const handleDepartmentsFocus = () => {
    if (!departmentsCalled) {
      getDepartments()
    }
  }
  const t = useTranslations('Forms')

  return (
    <Select
      id={`${formId}-department`}
      name="departmentId"
      value={formData.departmentId}
      isRequired={type?.endsWith('_EDIT') ? false : true}
      title={t('departments')}
      handleChange={handleChange}
      onFocus={handleDepartmentsFocus}
    >
      {departmentsLoading && (
        <Option value="loading" title={t('loading')} disabled />
      )}

      {!departmentsData && formData?.departmentName && (
        <Option value={formData.departmentId} title={formData.departmentName} />
      )}

      {departmentsData?.departments.map((department) => (
        <Option
          key={department.id}
          value={department.id}
          title={department.name}
        />
      ))}
    </Select>
  )
}
