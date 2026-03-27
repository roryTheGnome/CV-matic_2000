import { GET_POSITIONS } from "@/api/graphql/queries/positions"
import { Option } from "@/components/ui/select/Option"
import { Select } from "@/components/ui/select/Select"
import { GetPositionsResponse } from "@/types/position"
import { ModalFormState } from "@/types/user"
import { useLazyQuery } from "@apollo/client/react"
import { ChangeEvent } from "react"

interface Props {
  formId: string
  formData: ModalFormState
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function PositionsSelect({ formData, formId, handleChange }: Props) {
  const [
    getPositions,
    { data: positionsData, loading: positionsLoading, called: positionsCalled },
  ] = useLazyQuery<GetPositionsResponse>(GET_POSITIONS)

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
      isRequired
      title="Position"
      handleChange={handleChange}
      onFocus={handlePositionsFocus}
    >
      {positionsLoading && (
        <Option value="loading" title="Loading..." disabled />
      )}

      {positionsData?.positions.map(position => (
        <Option key={position.id} value={position.id} title={position.name} />
      ))}
    </Select>
  )
}
