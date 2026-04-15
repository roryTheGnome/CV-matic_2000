import { useModalStore } from '@/store/modalStore'
import { QueryResult, useQuery } from '@apollo/client/react'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { UserModal } from '../UserModal'

import { GetUserByIdData, GetUserByIdVariables } from '@/types/user'
import React from 'react'
import { UserForm } from '../UserForm'

jest.mock('../../../../api/graphql/mutations/user', () => ({
  GET_USER_BY_ID: 'GET_USER_BY_ID',
}))
jest.mock('../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="Loader" />,
}))
jest.mock('../../../../store/modalStore')
jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('../../ModalLayout', () => ({
  ModalLayout: ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <div data-testid="ModalLayout" data-title={title}>
      {children}
    </div>
  ),
}))
jest.mock('../UserForm', () => ({
  UserForm: jest.fn(() => <div data-testid="UserForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockUserForm = UserForm as jest.Mock

describe('UserModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders loading state correctly when fetching user data', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'user-123' },
      type: 'USER_EDIT',
    })
    mockUseQuery.mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    } as unknown as QueryResult<GetUserByIdData, GetUserByIdVariables>)

    render(<UserModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'loading',
    )
    expect(screen.getByTestId('Loader')).toBeInTheDocument()
    expect(screen.queryByTestId('UserForm')).not.toBeInTheDocument()
  })

  it('renders error state correctly when fetching user data fails', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'user-123' },
      type: 'USER_EDIT',
    })
    const mockError = new Error('Network failure')
    mockUseQuery.mockReturnValue({
      loading: false,
      error: mockError,
      data: undefined,
    } as unknown as QueryResult<GetUserByIdData, GetUserByIdVariables>)

    render(<UserModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
    expect(screen.getByText('Network failure')).toBeInTheDocument()
    expect(screen.queryByTestId('UserForm')).not.toBeInTheDocument()
  })

  it('renders correctly in create mode and skips the query', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'USER_CREATE',
    })
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: undefined,
    } as unknown as QueryResult<GetUserByIdData, GetUserByIdVariables>)

    render(<UserModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'createUser',
    )
    expect(screen.getByTestId('UserForm')).toBeInTheDocument()

    expect(mockUseQuery).toHaveBeenCalledWith(
      'GET_USER_BY_ID',
      expect.objectContaining({
        skip: true,
      }),
    )

    expect(MockUserForm).toHaveBeenCalledWith(
      {
        initialData: undefined,
        userId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode and maps fetched data to initialData format', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'user-123' },
      type: 'USER_EDIT',
    })

    const mockFetchedData = {
      user: {
        id: 'user-123',
        email: 'john.doe@example.com',
        role: 'Admin',
        profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
        department: {
          id: 'dept-1',
          name: 'Engineering',
        },
        position: {
          id: 'pos-1',
          name: 'Senior Developer',
        },
      },
    }

    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockFetchedData,
    } as unknown as QueryResult<GetUserByIdData, GetUserByIdVariables>)

    render(<UserModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'editUser',
    )
    expect(screen.getByTestId('UserForm')).toBeInTheDocument()

    expect(mockUseQuery).toHaveBeenCalledWith(
      'GET_USER_BY_ID',
      expect.objectContaining({
        skip: false,
        variables: { userId: 'user-123' },
      }),
    )

    expect(MockUserForm).toHaveBeenCalledWith(
      {
        initialData: {
          email: 'john.doe@example.com',
          password: '',
          firstName: 'John',
          lastName: 'Doe',
          departmentId: 'dept-1',
          departmentName: 'Engineering',
          positionId: 'pos-1',
          positionName: 'Senior Developer',
          role: 'Admin',
        },
        userId: 'user-123',
      },
      undefined,
    )
  })

  it('handles missing nested objects gracefully in edit mode', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'user-456' },
      type: 'USER_EDIT',
    })

    const mockFetchedData = {
      user: {
        id: 'user-456',
        email: 'jane.smith@example.com',
        role: 'Employee',
        profile: {
          first_name: 'Jane',
          last_name: 'Smith',
        },
        department: null,
        position: null,
      },
    }

    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockFetchedData,
    } as unknown as QueryResult<GetUserByIdData, GetUserByIdVariables>)

    render(<UserModal />)

    expect(MockUserForm).toHaveBeenCalledWith(
      {
        initialData: {
          email: 'jane.smith@example.com',
          password: '',
          firstName: 'Jane',
          lastName: 'Smith',
          departmentId: '',
          departmentName: undefined,
          positionId: '',
          positionName: undefined,
          role: 'Employee',
        },
        userId: 'user-456',
      },
      undefined,
    )
  })
})
