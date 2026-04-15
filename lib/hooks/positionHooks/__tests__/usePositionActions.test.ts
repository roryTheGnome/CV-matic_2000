import {
  CREATE_POSITION_MUTATION,
  UPDATE_POSITION_MUTATION,
} from '@/api/graphql/mutations/position'
import { GET_POSITIONS } from '@/api/graphql/queries/positions'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { usePositionActions } from '../usePositionActions'

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}))

jest.mock('../../../../store/modalStore.ts', () => ({
  useModalStore: jest.fn(),
}))

describe('usePositionActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreatePosition = jest.fn()
  const mockUpdatePosition = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'POSITION_CREATE',
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_POSITION_MUTATION) {
        return [mockCreatePosition, { loading: false }]
      }
      if (mutation === UPDATE_POSITION_MUTATION) {
        return [mockUpdatePosition, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values', () => {
    const { result } = renderHook(() => usePositionActions())

    expect(result.current.formData).toEqual({ name: '' })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() =>
      usePositionActions({ name: 'Developer' }),
    )

    expect(result.current.formData).toEqual({ name: 'Developer' })
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation on input change', () => {
    const { result } = renderHook(() =>
      usePositionActions({ name: 'Developer' }),
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Senior Developer' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('Senior Developer')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() =>
      usePositionActions({ name: 'Developer' }),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreatePosition).not.toHaveBeenCalled()
    expect(mockUpdatePosition).not.toHaveBeenCalled()
  })

  it('should call createPosition mutation when form is dirty and no ID is provided', () => {
    const { result } = renderHook(() => usePositionActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Manager' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreatePosition).toHaveBeenCalledWith({
      variables: {
        position: { name: 'Manager' },
      },
    })
  })

  it('should call updatePosition mutation when form is dirty and ID is provided', () => {
    const { result } = renderHook(() =>
      usePositionActions({ name: 'Developer' }, 'pos-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Lead Developer' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdatePosition).toHaveBeenCalledWith({
      variables: {
        position: {
          positionId: 'pos-123',
          name: 'Lead Developer',
        },
      },
    })
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => usePositionActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_POSITION_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('positionCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle successful update callbacks', () => {
    renderHook(() => usePositionActions({ name: 'Developer' }, 'pos-123'))

    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_POSITION_MUTATION,
    )[1]

    act(() => {
      updateConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('positionUpdatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => usePositionActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_POSITION_MUTATION,
    )[1]

    act(() => {
      createConfig.onError(new Error('Network error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network error')
  })

  it('should update apollo cache successfully on create', () => {
    renderHook(() => usePositionActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_POSITION_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest
        .fn()
        .mockReturnValue({ positions: [{ id: '1', name: 'Developer' }] }),
      writeQuery: jest.fn(),
    }

    const mockData = {
      createPosition: { id: '2', name: 'Designer' },
    }

    act(() => {
      createConfig.update(mockCache, { data: mockData })
    })

    expect(mockCache.readQuery).toHaveBeenCalledWith({ query: GET_POSITIONS })
    expect(mockCache.writeQuery).toHaveBeenCalledWith({
      query: GET_POSITIONS,
      data: {
        positions: [mockData.createPosition, { id: '1', name: 'Developer' }],
      },
    })
  })

  it('should not throw if cache read returns null during update', () => {
    renderHook(() => usePositionActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_POSITION_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest.fn().mockReturnValue(null),
      writeQuery: jest.fn(),
    }

    act(() => {
      createConfig.update(mockCache, {
        data: { createPosition: { id: '2', name: 'Designer' } },
      })
    })

    expect(mockCache.readQuery).toHaveBeenCalled()
    expect(mockCache.writeQuery).not.toHaveBeenCalled()
  })
})
