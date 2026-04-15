import { useModalStore } from '@/store/modalStore'
import { GetCvByIdData, GetCvByIdVariables } from '@/types/cvs'
import { QueryResult, useQuery } from '@apollo/client/react'
import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { CvProjectModal } from '../CvProjectModal'

import React from 'react'
import { CvProjectForm } from '../CvProjectForm'

jest.mock('../../../../api/graphql/queries/cvs', () => ({
  GET_CV_BY_ID: 'GET_CV_BY_ID',
}))
jest.mock('../../../../components/ui/Loader', () => ({
  Loader: () => <div data-testid="Loader" />,
}))
jest.mock('../../../../store/modalStore')
jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('next/navigation')
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
jest.mock('../CvProjectForm', () => ({
  CvProjectForm: jest.fn(() => <div data-testid="CvProjectForm" />),
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseParams = useParams as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const MockCvProjectForm = CvProjectForm as jest.Mock

const mockCvData: GetCvByIdData = {
  cv: {
    id: 'cv-123',
    projects: [
      {
        project: { id: 'proj-1' },
        responsibilities: ['Development', 'Testing'],
        roles: ['Frontend Developer'],
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        description: 'Project description',
        domain: 'Finance',
        name: 'Banking App',
        environment: ['React', 'TypeScript'],
      },
    ],
  },
} as unknown as GetCvByIdData

describe('CvProjectModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseParams.mockReturnValue({ id: 'cv-123' })
  })

  it('renders loading state correctly', () => {
    mockUseModalStore.mockReturnValue({ data: null, type: 'CV_PROJECT_ADD' })
    mockUseQuery.mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    } as unknown as QueryResult<GetCvByIdData, GetCvByIdVariables>)

    render(<CvProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'loading',
    )
    expect(screen.getByTestId('Loader')).toBeInTheDocument()
    expect(screen.queryByTestId('CvProjectForm')).not.toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    mockUseModalStore.mockReturnValue({ data: null, type: 'CV_PROJECT_ADD' })
    const mockError = new Error('Failed to fetch')
    mockUseQuery.mockReturnValue({
      loading: false,
      error: mockError,
      data: undefined,
    } as unknown as QueryResult<GetCvByIdData, GetCvByIdVariables>)

    render(<CvProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'errorOccurred',
    )
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    expect(screen.queryByTestId('CvProjectForm')).not.toBeInTheDocument()
  })

  it('renders correctly in add mode with default empty values', () => {
    mockUseModalStore.mockReturnValue({ data: null, type: 'CV_PROJECT_ADD' })
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockCvData,
    } as unknown as QueryResult<GetCvByIdData, GetCvByIdVariables>)

    render(<CvProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'cvAddProjectModal',
    )
    expect(screen.getByTestId('CvProjectForm')).toBeInTheDocument()

    expect(MockCvProjectForm).toHaveBeenCalledWith(
      {
        initialData: {
          cvId: 'cv-123',
          projectId: '',
          responsibilities: '',
          roles: '',
          start_date: '',
          end_date: '',
          description: '',
          domain: '',
          name: '',
          environment: '',
        },
        projectId: undefined,
      },
      undefined,
    )
  })

  it('renders correctly in edit mode with mapped values from cvData', () => {
    mockUseModalStore.mockReturnValue({
      data: { projectId: 'proj-1' },
      type: 'CV_PROJECT_EDIT',
    })
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockCvData,
    } as unknown as QueryResult<GetCvByIdData, GetCvByIdVariables>)

    render(<CvProjectModal />)

    expect(screen.getByTestId('ModalLayout')).toHaveAttribute(
      'data-title',
      'cvEditProjectModal',
    )
    expect(screen.getByTestId('CvProjectForm')).toBeInTheDocument()

    expect(MockCvProjectForm).toHaveBeenCalledWith(
      {
        initialData: {
          cvId: 'cv-123',
          projectId: 'proj-1',
          responsibilities: 'Development,Testing',
          roles: 'Frontend Developer',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          description: 'Project description',
          domain: 'Finance',
          name: 'Banking App',
          environment: 'React,TypeScript',
        },
        projectId: 'proj-1',
      },
      undefined,
    )
  })

  it('handles missing project in cvData gracefully during edit mode', () => {
    mockUseModalStore.mockReturnValue({
      data: { projectId: 'non-existent-proj' },
      type: 'CV_PROJECT_EDIT',
    })
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockCvData,
    } as unknown as QueryResult<GetCvByIdData, GetCvByIdVariables>)

    render(<CvProjectModal />)

    expect(MockCvProjectForm).toHaveBeenCalledWith(
      {
        initialData: {
          cvId: 'cv-123',
          projectId: 'non-existent-proj',
          responsibilities: '',
          roles: '',
          start_date: '',
          end_date: '',
          description: '',
          domain: '',
          name: '',
          environment: '',
        },
        projectId: 'non-existent-proj',
      },
      undefined,
    )
  })
})
