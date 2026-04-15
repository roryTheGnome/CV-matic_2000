import { act, renderHook } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import {
  CreateUserData,
  CreateUserModalFormState,
  CreateUserVariables,
  GetUsersResponse,
  UpdateUserData,
  UpdateUserVariables,
} from '@/types/user'
import { ApolloCache, DefaultContext } from '@apollo/client'
import { MutationTuple, useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import toast from 'react-hot-toast'
import { useUserActions } from '../useUserActions'

jest.mock('../../../../api/graphql/mutations/user.ts', () => ({
  CREATE_USER_MUTATION: 'CREATE_USER_MUTATION',
  UPDATE_USER_MUTATION: 'UPDATE_USER_MUTATION',
  UPDATE_PROFILE_MUTATION: 'UPDATE_PROFILE_MUTATION',
}))

jest.mock('../../../../api/graphql/queries/user', () => ({
  GET_USERS: 'GET_USERS',
}))

jest.mock('../../../../store/modalStore', () => ({
  useModalStore: jest.fn(),
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

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockToastSuccess = toast.success as jest.Mock
const mockToastError = toast.error as jest.Mock

interface MutationOptions<TData> {
  update?: (cache: ApolloCache, result: { data?: TData }) => void
  onCompleted?: () => void
  onError?: (error: Error) => void
}

const defaultFormData: CreateUserModalFormState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  departmentId: '',
  positionId: '',
  role: 'Employee',
}

const mockInitialData: CreateUserModalFormState = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  departmentId: 'dep-1',
  positionId: 'pos-1',
  role: 'Admin',
}

describe('useUserActions', () => {
  let mockCloseModal: jest.Mock
  let mockCreateUser: jest.Mock
  let mockUpdateUser: jest.Mock
  let mockUpdateProfile: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockCloseModal = jest.fn()
    mockCreateUser = jest.fn()
    mockUpdateUser = jest.fn()
    mockUpdateProfile = jest.fn()

    mockUseModalStore.mockReturnValue({
      type: 'create',
      closeModal: mockCloseModal,
    })

    mockUseTranslations.mockReturnValue((key: string) => key)

    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'CREATE_USER_MUTATION') {
        return [mockCreateUser, { loading: false }] as unknown as MutationTuple<
          CreateUserData,
          CreateUserVariables,
          DefaultContext,
          ApolloCache
        >
      }
      if (mutation === 'UPDATE_USER_MUTATION') {
        return [mockUpdateUser, { loading: false }] as unknown as MutationTuple<
          UpdateUserData,
          UpdateUserVariables,
          DefaultContext,
          ApolloCache
        >
      }
      if (mutation === 'UPDATE_PROFILE_MUTATION') {
        return [
          mockUpdateProfile,
          { loading: false },
        ] as unknown as MutationTuple<unknown, DefaultContext, ApolloCache>
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default state when initialData is not provided', () => {
    const { result } = renderHook(() => useUserActions())

    expect(result.current.formData).toEqual(defaultFormData)
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.loading).toBe(false)
  })

  it('should initialize with provided initialData', () => {
    const { result } = renderHook(() =>
      useUserActions(mockInitialData, 'user-123'),
    )

    expect(result.current.formData).toEqual(mockInitialData)
    expect(result.current.isDirty).toBe(false)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should update formData and set isDirty to true on handleChange', () => {
    const { result } = renderHook(() => useUserActions(mockInitialData))

    const event = {
      target: { name: 'firstName', value: 'Jane' },
    } as React.ChangeEvent<HTMLInputElement>

    act(() => {
      result.current.handleChange(event)
    })

    expect(result.current.formData.firstName).toBe('Jane')
    expect(result.current.isDirty).toBe(true)
  })

  it('should evaluate isFormValid correctly for new users', () => {
    const { result } = renderHook(() => useUserActions())

    expect(result.current.isFormValid).toBe(false)

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'a@a.com' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'password', value: 'pass' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'firstName', value: 'A' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'lastName', value: 'B' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'departmentId', value: '1' },
      } as React.ChangeEvent<HTMLSelectElement>)
      result.current.handleChange({
        target: { name: 'positionId', value: '1' },
      } as React.ChangeEvent<HTMLSelectElement>)
    })

    expect(result.current.isFormValid).toBe(true)
  })

  it('should close modal without saving if form is submitted without changes', () => {
    const { result } = renderHook(() =>
      useUserActions(mockInitialData, 'user-123'),
    )

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('should call createUser mutation on valid submit when userId is omitted', () => {
    const { result } = renderHook(() => useUserActions())

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'new@test.com' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockCreateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          auth: { email: 'new@test.com', password: '' },
          profile: { first_name: '', last_name: '' },
          departmentId: '',
          positionId: '',
          cvsIds: [],
          role: 'Employee',
        },
      },
    })
  })

  it('should call updateUser and updateProfile mutations on valid submit when userId is provided', () => {
    const { result } = renderHook(() =>
      useUserActions(mockInitialData, 'user-123'),
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'firstName', value: 'Jane' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockUpdateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          userId: 'user-123',
          departmentId: 'dep-1',
          positionId: 'pos-1',
          role: 'Admin',
          cvsIds: [],
        },
      },
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
  })

  it('should handle onCompleted for create mutation correctly', () => {
    let onCompletedCallback: (() => void) | undefined

    mockUseMutation.mockImplementation(
      (mutation: string, options?: MutationOptions<CreateUserData>) => {
        if (mutation === 'CREATE_USER_MUTATION') {
          onCompletedCallback = options?.onCompleted
          return [
            mockCreateUser,
            { loading: false },
          ] as unknown as MutationTuple<
            CreateUserData,
            CreateUserVariables,
            DefaultContext,
            ApolloCache
          >
        }
        return [jest.fn(), { loading: false }]
      },
    )

    renderHook(() => useUserActions())

    act(() => {
      if (onCompletedCallback) {
        onCompletedCallback()
      }
    })

    expect(mockToastSuccess).toHaveBeenCalledWith('userCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onError for create mutation correctly', () => {
    let onErrorCallback: ((err: Error) => void) | undefined

    mockUseMutation.mockImplementation(
      (mutation: string, options?: MutationOptions<CreateUserData>) => {
        if (mutation === 'CREATE_USER_MUTATION') {
          onErrorCallback = options?.onError
          return [
            mockCreateUser,
            { loading: false },
          ] as unknown as MutationTuple<
            CreateUserData,
            CreateUserVariables,
            DefaultContext,
            ApolloCache
          >
        }
        return [jest.fn(), { loading: false }]
      },
    )

    renderHook(() => useUserActions())

    act(() => {
      if (onErrorCallback) {
        onErrorCallback(new Error('Creation failed'))
      }
    })

    expect(mockToastError).toHaveBeenCalledWith('Creation failed')
  })

  it('should update cache after successful user creation', () => {
    let updateCallback:
      | ((cache: ApolloCache, result: { data?: CreateUserData }) => void)
      | undefined

    mockUseMutation.mockImplementation(
      (mutation: string, options?: MutationOptions<CreateUserData>) => {
        if (mutation === 'CREATE_USER_MUTATION') {
          updateCallback = options?.update
          return [
            mockCreateUser,
            { loading: false },
          ] as unknown as MutationTuple<
            CreateUserData,
            CreateUserVariables,
            DefaultContext,
            ApolloCache
          >
        }
        return [jest.fn(), { loading: false }]
      },
    )

    renderHook(() => useUserActions())

    const mockReadQuery = jest.fn().mockReturnValue({
      users: [{ id: 'old-user' }],
    } as unknown as GetUsersResponse)
    const mockWriteQuery = jest.fn()

    const mockCache = {
      readQuery: mockReadQuery,
      writeQuery: mockWriteQuery,
    } as unknown as ApolloCache

    const createdUserData = {
      createUser: { id: 'new-user' },
    } as unknown as CreateUserData

    act(() => {
      if (updateCallback) {
        updateCallback(mockCache, { data: createdUserData })
      }
    })

    expect(mockReadQuery).toHaveBeenCalled()
    expect(mockWriteQuery).toHaveBeenCalledWith({
      query: 'GET_USERS',
      data: {
        users: [{ id: 'new-user' }, { id: 'old-user' }],
      },
    })
  })
})
