import { useModalStore } from '@/store/modalStore'
import { QueryResult, useQuery } from '@apollo/client/react'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { ProjectModal } from '../ProjectModal'

import { GetProjectByIdData, GetProjectByIdVariables } from '@/types/project'
import React from 'react'
import { ProjectForm } from '../ProjectForm'

jest.mock('../../../../api/graphql/queries/projects', () => ({
  GET_PROJECT_BY_ID: 'GET_PROJECT_BY_ID',
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
jest.mock('../ProjectForm', () => ({
  ProjectForm: jest.fn(() => <div data-testid="ProjectForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockProjectForm = ProjectForm as jest.Mock

describe('ProjectModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders loading state correctly when fetching project data', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'proj-123' },
      type: 'PROJECT_EDIT',
    })
    mockUseQuery.mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    } as unknown as QueryResult<GetProjectByIdData, GetProjectByIdVariables>)

    render(<ProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'loading',
    )
    expect(screen.getByTestId('Loader')).toBeInTheDocument()
    expect(screen.queryByTestId('ProjectForm')).not.toBeInTheDocument()
  })

  it('renders error state correctly when fetching project data fails', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'proj-123' },
      type: 'PROJECT_EDIT',
    })
    const mockError = new Error('Network failure')
    mockUseQuery.mockReturnValue({
      loading: false,
      error: mockError,
      data: undefined,
    } as unknown as QueryResult<GetProjectByIdData, GetProjectByIdVariables>)

    render(<ProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
    expect(screen.getByText('Network failure')).toBeInTheDocument()
    expect(screen.queryByTestId('ProjectForm')).not.toBeInTheDocument()
  })

  it('renders correctly in create mode without fetching data', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'PROJECT_CREATE',
    })
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: undefined,
    } as unknown as QueryResult<GetProjectByIdData, GetProjectByIdVariables>)

    render(<ProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'createProject',
    )
    expect(screen.getByTestId('ProjectForm')).toBeInTheDocument()

    expect(mockUseQuery).toHaveBeenCalledWith(
      'GET_PROJECT_BY_ID',
      expect.objectContaining({
        skip: true,
      }),
    )

    expect(MockProjectForm).toHaveBeenCalledWith(
      {
        initialData: undefined,
        projectId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode and maps fetched data to initialData format', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'proj-123' },
      type: 'PROJECT_EDIT',
    })

    const mockFetchedData: GetProjectByIdData = {
      project: {
        id: 'proj-123',
        name: 'Alpha Project',
        domain: 'Healthcare',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        description: 'Test description',
        environment: ['React', 'Node.js', 'PostgreSQL'],
      },
    }

    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockFetchedData,
    } as unknown as QueryResult<GetProjectByIdData, GetProjectByIdVariables>)

    render(<ProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'editProject',
    )
    expect(screen.getByTestId('ProjectForm')).toBeInTheDocument()

    expect(mockUseQuery).toHaveBeenCalledWith(
      'GET_PROJECT_BY_ID',
      expect.objectContaining({
        skip: false,
        variables: { projectId: 'proj-123' },
      }),
    )

    expect(MockProjectForm).toHaveBeenCalledWith(
      {
        initialData: {
          name: 'Alpha Project',
          domain: 'Healthcare',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          description: 'Test description',
          environment: 'React,Node.js,PostgreSQL',
        },
        projectId: 'proj-123',
      },
      undefined,
    )
  })

  it('handles missing array fields gracefully in edit mode', () => {
    mockUseModalStore.mockReturnValue({
      data: { id: 'proj-123' },
      type: 'PROJECT_EDIT',
    })

    const mockFetchedData: GetProjectByIdData = {
      project: {
        id: 'proj-123',
        name: 'Beta Project',
        domain: '',
        start_date: '',
        end_date: '',
        description: '',
        environment: null as unknown as string[],
      },
    }

    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockFetchedData,
    } as unknown as QueryResult<GetProjectByIdData, GetProjectByIdVariables>)

    render(<ProjectModal />)

    expect(MockProjectForm).toHaveBeenCalledWith(
      {
        initialData: {
          name: 'Beta Project',
          domain: '',
          start_date: '',
          end_date: '',
          description: '',
          environment: '',
        },
        projectId: 'proj-123',
      },
      undefined,
    )
  })
})
