import { GET_POSITIONS } from "@/api/graphql/queries/positions"
import { Option } from "@/components/ui/select/Option"
import { Select } from "@/components/ui/select/Select"
import { useModalStore } from "@/store/modalStore"
import { GetPositionsResponse } from "@/types/position"
import { CreateUserModalFormState } from "@/types/user"
import { useLazyQuery } from "@apollo/client/react"
import { ChangeEvent } from "react"

interface Props {
  formId: string
  formData: CreateUserModalFormState
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function PositionsSelect({ formData, formId, handleChange }: Props) {
  const [
    getPositions,
    { data: positionsData, loading: positionsLoading, called: positionsCalled },
  ] = useLazyQuery<GetPositionsResponse>(GET_POSITIONS)
  const { type } = useModalStore()

  const handlePositionsFocus = () => {
    if (!positionsCalled) {
      getPositions()
    }
  }
  return (
    <Select
      id={`${formId}-position`}
      name="positionId"
      value={formData.positionId}
      isRequired={type?.endsWith("_EDIT") ? false : true}
      title="Position"
      handleChange={handleChange}
      onFocus={handlePositionsFocus}
    >
      {positionsLoading && (
        <Option value="loading" title="Loading..." disabled />
      )}

      {!positionsData && formData?.positionName && (
        <Option value={formData.positionId} title={formData.positionName} />
      )}

      {positionsData?.positions.map(position => (
        <Option key={position.id} value={position.id} title={position.name} />
      ))}
    </Select>
  )
}
