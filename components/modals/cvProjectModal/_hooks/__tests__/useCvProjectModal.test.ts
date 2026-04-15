import { useModalStore } from '@/store/modalStore'
import { AddCvProjectModalFormState } from '@/types/cvs'
import { useMutation, useQuery } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import { useCvProjectModal } from '../useCvProjectModal'

jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
jest.mock('../../../../../store/modalStore', () => ({
  useModalStore: jest.fn(),
}))
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../../../../api/graphql/mutations/cv', () => ({
  ADD_CV_PROJECT_MUTATION: 'ADD_CV_PROJECT_MUTATION',
  UPDATE_CV_PROJECT_MUTATION: 'UPDATE_CV_PROJECT_MUTATION',
}))
jest.mock('../../../../../api/graphql/queries/cvs', () => ({
  GET_CV_BY_ID: 'GET_CV_BY_ID',
}))
jest.mock('../../../../../api/graphql/queries/projects', () => ({
  GET_PROJECTS: 'GET_PROJECTS',
}))

const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockUseParams = useParams as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('useCvProjectModal', () => {
  const mockCloseModal = jest.fn()
  const mockAddCvProject = jest.fn()
  const mockUpdateCvProject = jest.fn()

  const defaultInitialData: AddCvProjectModalFormState = {
    cvId: 'cv-123',
    projectId: '',
    responsibilities: '',
    roles: '',
    start_date: '',
    end_date: '',
    description: '',
    domain: '',
    environment: '',
    name: '',
  }

  const mockProjectsData = {
    projects: [
      {
        id: 'proj-1',
        name: 'Alpha Project',
        description: 'Alpha description',
        domain: 'Finance',
        environment: ['React', 'Node'],
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseParams.mockReturnValue({ id: 'cv-123' })
    mockUseModalStore.mockReturnValue({
      data: null,
      type: 'ADD_CV_PROJECT',
      closeModal: mockCloseModal,
    })

    mockUseQuery.mockReturnValue({
      data: mockProjectsData,
      loading: false,
    })

    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'ADD_CV_PROJECT_MUTATION') {
        return [mockAddCvProject, { loading: false, error: undefined }]
      }
      if (mutation === 'UPDATE_CV_PROJECT_MUTATION') {
        return [mockUpdateCvProject, { loading: false, error: undefined }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default values when initialData is not provided', () => {
    const { result } = renderHook(() => useCvProjectModal())

    expect(result.current.formData).toEqual({
      cvId: 'cv-123',
      projectId: '',
      responsibilities: '',
      roles: '',
      start_date: '',
      end_date: '',
      description: '',
      domain: '',
      environment: '',
      name: '',
    })
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(false)
  })

  it('should initialize with provided initialData', () => {
    const initialData: AddCvProjectModalFormState = {
      ...defaultInitialData,
      name: 'Existing Project',
      domain: 'Health',
      start_date: '2023-01-01',
      description: 'Desc',
      environment: 'Vue',
    }

    const { result } = renderHook(() => useCvProjectModal(initialData))

    expect(result.current.formData).toEqual(initialData)
    expect(result.current.isDirty).toBe(false)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should format projectOptions correctly based on query data', () => {
    const { result } = renderHook(() => useCvProjectModal())

    expect(result.current.projectOptions).toEqual([
      { label: 'Alpha Project', value: 'proj-1' },
    ])
  })

  it('should update formData correctly on standard handleChange', () => {
    const { result } = renderHook(() => useCvProjectModal(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'New Custom Project' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('New Custom Project')
    expect(result.current.isDirty).toBe(true)
  })

  it('should autofill other fields when projectId is selected', () => {
    const { result } = renderHook(() => useCvProjectModal(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'projectId', value: 'proj-1' },
      })
    })

    expect(result.current.formData.projectId).toBe('proj-1')
    expect(result.current.formData.name).toBe('Alpha description')
    expect(result.current.formData.domain).toBe('Finance')
    expect(result.current.formData.description).toBe('Alpha description')
    expect(result.current.formData.environment).toBe('React,Node')
  })

  it('should call closeModal on submit if form is not dirty', () => {
    const initialData: AddCvProjectModalFormState = {
      ...defaultInitialData,
      name: 'Existing',
    }
    const { result } = renderHook(() => useCvProjectModal(initialData))

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as never)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockAddCvProject).not.toHaveBeenCalled()
    expect(mockUpdateCvProject).not.toHaveBeenCalled()
  })

  it('should call addCvProject mutation on valid submit when projectId is not provided to hook', () => {
    const { result } = renderHook(() => useCvProjectModal())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Test Name' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'projectId', value: 'new-proj-id' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'roles', value: 'Developer, Tester' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'responsibilities', value: 'Coding, Review' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'start_date', value: '2023-01-01' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as never)
    })

    expect(mockAddCvProject).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: 'cv-123',
          projectId: 'new-proj-id',
          responsibilities: ['Coding', ' Review'],
          roles: ['Developer', ' Tester'],
          start_date: '2023-01-01',
          end_date: null,
        },
      },
    })
  })

  it('should call updateCvProject mutation on valid submit when projectId is provided to hook', () => {
    const initialData: AddCvProjectModalFormState = {
      ...defaultInitialData,
      projectId: 'existing-proj-id',
      roles: 'Admin',
      start_date: '2022-01-01',
      end_date: '2022-12-31',
    }
    const { result } = renderHook(() =>
      useCvProjectModal(initialData, 'existing-proj-id'),
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'roles', value: 'Admin, Lead' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent as never)
    })

    expect(mockUpdateCvProject).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: 'cv-123',
          projectId: 'existing-proj-id',
          responsibilities: [],
          roles: ['Admin', ' Lead'],
          start_date: '2022-01-01',
          end_date: '2022-12-31',
        },
      },
    })
  })
})
