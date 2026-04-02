export type Position = {
  id: string
  name: string
}

export type GetPositionsResponse = {
  positions: {
    id: string
    name: string
  }[]
}

export interface CreatePositionModalFormState {
  name: string
}

export interface CreatePositionVariables {
  position: {
    name: string
  }
}

export interface UpdatePositionVariables {
  position: {
    positionId: string
    name: string
  }
}

export interface PositionData {
  createPosition: {
    id: string
    name: string
  }
}

export interface DeletePositionVariables {
  position: {
    positionId: string
  }
}

export interface DeletePositionResponse {
  deletePosition: {
    affected: number
  }
}
