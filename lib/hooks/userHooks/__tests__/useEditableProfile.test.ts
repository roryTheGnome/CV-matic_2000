import { act, renderHook } from '@testing-library/react'

import { toBase64 } from '@/constants/toBase64'
import { GetDepartmentsResponse } from '@/types/department'
import { GetPositionsResponse } from '@/types/position'
import { UploadAvatarResponse, UploadAvatarVariables, User } from '@/types/user'
import { ApolloCache, DefaultContext } from '@apollo/client'
import {
  MutationTuple,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useEditableProfile } from '../useEditableProfile'

jest.mock('../../../../api/graphql/mutations/user', () => ({
  DELETE_AVATAR: 'DELETE_AVATAR',
  UPLOAD_AVATAR: 'UPLOAD_AVATAR',
}))
jest.mock('../../../../api/graphql/queries/departments', () => ({
  GET_DEPARTMENTS: 'GET_DEPARTMENTS',
}))
jest.mock('../../../../api/graphql/queries/positions', () => ({
  GET_POSITIONS: 'GET_POSITIONS',
}))
jest.mock('../../../../api/graphql/queries/user', () => ({
  GET_USER: 'GET_USER',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_USER: 'UPDATE_USER',
}))
jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('../../../../constants/toBase64')

const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockToastSuccess = toast.success as jest.Mock
const mockToBase64 = toBase64 as jest.Mock

interface UpdateUserMutationOptions {
  refetchQueries?: unknown[]
  onCompleted?: () => void
  onError?: (error: Error) => void
}

const mockUser: User = {
  id: 'user-123',
  profile: {
    first_name: 'John',
    last_name: 'Doe',
    avatar: 'avatar.png',
  },
  department: {
    id: 'dep-1',
    name: 'IT',
  },
  position: {
    id: 'pos-1',
    name: 'Developer',
  },
} as User

describe('useEditableProfile', () => {
  let mockUpdateProfile: jest.Mock
  let mockUpdateUser: jest.Mock
  let mockUploadAvatar: jest.Mock
  let mockDeleteAvatar: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockUpdateProfile = jest.fn()
    mockUpdateUser = jest.fn()
    mockUploadAvatar = jest.fn()
    mockDeleteAvatar = jest.fn()

    mockUseTranslations.mockReturnValue((key: string) => key)

    mockUseQuery.mockImplementation((query: string) => {
      if (query === 'GET_DEPARTMENTS') {
        return {
          data: undefined,
          loading: false,
        } as QueryResult<GetDepartmentsResponse>
      }
      if (query === 'GET_POSITIONS') {
        return {
          data: undefined,
          loading: false,
        } as QueryResult<GetPositionsResponse>
      }
      return { data: undefined, loading: false }
    })

    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'UPDATE_PROFILE') {
        return [
          mockUpdateProfile,
          { loading: false },
        ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
      }
      if (mutation === 'UPDATE_USER') {
        return [mockUpdateUser, { loading: false }] as unknown as MutationTuple<
          unknown,
          DefaultContext,
          ApolloCache
        >
      }
      if (mutation === 'UPLOAD_AVATAR') {
        return [
          mockUploadAvatar,
          { loading: false },
        ] as unknown as MutationTuple<
          UploadAvatarResponse,
          UploadAvatarVariables,
          DefaultContext,
          ApolloCache
        >
      }
      if (mutation === 'DELETE_AVATAR') {
        return [
          mockDeleteAvatar,
          { loading: false },
        ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
      }
      return [jest.fn(), { loading: false }]
    })

    mockToBase64.mockResolvedValue('base64string')
  })

  it('should initialize with user data correctly', () => {
    const { result } = renderHook(() => useEditableProfile(mockUser))

    expect(result.current.firstName).toBe('John')
    expect(result.current.lastName).toBe('Doe')
    expect(result.current.departmentId).toBe('dep-1')
    expect(result.current.positionId).toBe('pos-1')
    expect(result.current.preview).toBe('avatar.png')
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  it('should update unsaved changes status when fields are modified', () => {
    const { result } = renderHook(() => useEditableProfile(mockUser))

    act(() => {
      result.current.setFirstName('Jane')
    })

    expect(result.current.firstName).toBe('Jane')
    expect(result.current.hasUnsavedChanges).toBe(true)

    act(() => {
      result.current.setFirstName('John')
    })

    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  it('should handle avatar upload correctly', async () => {
    mockUploadAvatar.mockResolvedValue({
      data: { uploadAvatar: 'new-avatar-url.png' },
    })

    const { result } = renderHook(() => useEditableProfile(mockUser))

    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    })
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    await act(async () => {
      await result.current.handleAvatarChange(event)
    })

    expect(mockToBase64).toHaveBeenCalledWith(file)
    expect(mockUploadAvatar).toHaveBeenCalledWith({
      variables: {
        avatar: {
          userId: 'user-123',
          base64: 'base64string',
          size: file.size,
          type: file.type,
        },
      },
    })
    expect(result.current.preview).toBe('new-avatar-url.png')
  })

  it('should not proceed with avatar upload if file is missing', async () => {
    const { result } = renderHook(() => useEditableProfile(mockUser))

    const event = {
      target: { files: null },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    await act(async () => {
      await result.current.handleAvatarChange(event)
    })

    expect(mockToBase64).not.toHaveBeenCalled()
    expect(mockUploadAvatar).not.toHaveBeenCalled()
  })

  it('should handle avatar deletion correctly', async () => {
    mockDeleteAvatar.mockResolvedValue({})

    const { result } = renderHook(() => useEditableProfile(mockUser))

    await act(async () => {
      await result.current.handleDeleteAvatar()
    })

    expect(mockDeleteAvatar).toHaveBeenCalledWith({
      variables: {
        avatar: { userId: 'user-123' },
      },
    })
    expect(result.current.preview).toBeNull()
  })

  it('should call save mutations with correct variables', async () => {
    mockUpdateProfile.mockResolvedValue({})
    mockUpdateUser.mockResolvedValue({})

    const { result } = renderHook(() => useEditableProfile(mockUser))

    act(() => {
      result.current.setFirstName('Jane')
      result.current.setDepartmentId('dep-2')
    })

    await act(async () => {
      await result.current.handleSave()
    })

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      variables: {
        profile: {
          userId: 'user-123',
          first_name: 'Jane',
          last_name: 'Doe',
        },
      },
    })

    expect(mockUpdateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          userId: 'user-123',
          positionId: 'pos-1',
          departmentId: 'dep-2',
        },
      },
    })
  })

  it('should show success toast when updateUser completes', () => {
    let onCompletedCallback: (() => void) | undefined

    mockUseMutation.mockImplementation(
      (mutation: string, options?: UpdateUserMutationOptions) => {
        if (mutation === 'UPDATE_USER') {
          onCompletedCallback = options?.onCompleted
          return [
            mockUpdateUser,
            { loading: false },
          ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
        }
        return [jest.fn(), { loading: false }]
      },
    )

    renderHook(() => useEditableProfile(mockUser))

    act(() => {
      if (onCompletedCallback) {
        onCompletedCallback()
      }
    })

    expect(mockToastSuccess).toHaveBeenCalledWith('userUpdatedSuccess')
  })

  it('should show success toast with error message when updateUser throws an error', () => {
    let onErrorCallback: ((error: Error) => void) | undefined

    mockUseMutation.mockImplementation(
      (mutation: string, options?: UpdateUserMutationOptions) => {
        if (mutation === 'UPDATE_USER') {
          onErrorCallback = options?.onError
          return [
            mockUpdateUser,
            { loading: false },
          ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
        }
        return [jest.fn(), { loading: false }]
      },
    )

    renderHook(() => useEditableProfile(mockUser))

    act(() => {
      if (onErrorCallback) {
        onErrorCallback(new Error('Update failed'))
      }
    })

    expect(mockToastSuccess).toHaveBeenCalledWith('Update failed')
  })

  it('should aggregate loading states from mutations', () => {
    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'UPDATE_PROFILE') {
        return [
          mockUpdateProfile,
          { loading: true },
        ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
      }
      return [jest.fn(), { loading: false }]
    })

    const { result } = renderHook(() => useEditableProfile(mockUser))

    expect(result.current.loading).toBe(true)
  })
})
