import { act, renderHook } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import {
  CreateCvSkillInput,
  Cvs,
  GetCvByIdData,
  UpdateCvSkillInput,
} from '@/types/cvs'
import { GetSkillsData, SkillMastery } from '@/types/skills'
import { ApolloCache, DefaultContext } from '@apollo/client'
import {
  MutationTuple,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import toast from 'react-hot-toast'
import { useCvSkillForm } from '../useCvSkillForm'

jest.mock('../../../../../api/graphql/mutations/cv', () => ({
  ADD_CV_SKILL_MUTATION: 'ADD_CV_SKILL_MUTATION',
  UPDATE_CV_SKILL_MUTATION: 'UPDATE_CV_SKILL_MUTATION',
}))
jest.mock('../../../../../api/graphql/queries/cvs', () => ({
  GET_CV_BY_ID: 'GET_CV_BY_ID',
}))
jest.mock('../../../../../api/graphql/queries/skills', () => ({
  GET_SKILLS: 'GET_SKILLS',
}))
jest.mock('../../../../../store/modalStore')
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
const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockToastError = toast.error as jest.Mock

const mockSkillData: SkillMastery = {
  name: 'React',
  mastery: 'Proficient',
} as SkillMastery

const mockAllSkills: GetSkillsData = {
  skills: [
    { id: '1', name: 'React', category: { id: 'cat-1', name: 'Frontend' } },
    { id: '2', name: 'Node.js', category: { id: 'cat-2', name: 'Backend' } },
    {
      id: '3',
      name: 'TypeScript',
      category: { id: 'cat-1', name: 'Frontend' },
    },
  ] as unknown[],
} as unknown as GetSkillsData

const mockCvData: GetCvByIdData = {
  cv: {
    id: 'cv-123',
    skills: [{ name: 'React' }],
  },
} as unknown as GetCvByIdData

describe('useCvSkillForm', () => {
  let mockCloseModal: jest.Mock
  let mockAddCvSkill: jest.Mock
  let mockUpdateCvSkill: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockCloseModal = jest.fn()
    mockAddCvSkill = jest.fn()
    mockUpdateCvSkill = jest.fn()

    mockUseTranslations.mockReturnValue((key: string) => key)

    mockUseModalStore.mockReturnValue({
      data: { id: 'cv-123', skill: { categoryId: 'cat-1', mastery: 'Novice' } },
      type: 'CV_SKILL_ADD',
      closeModal: mockCloseModal,
    })

    mockUseQuery.mockImplementation((query: string) => {
      if (query === 'GET_SKILLS') {
        return {
          data: mockAllSkills,
          loading: false,
          error: undefined,
        } as QueryResult<GetSkillsData>
      }
      if (query === 'GET_CV_BY_ID') {
        return {
          data: mockCvData,
          loading: false,
          error: undefined,
        } as QueryResult<GetCvByIdData>
      }
      return { data: undefined, loading: false, error: undefined }
    })

    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'ADD_CV_SKILL_MUTATION') {
        return [mockAddCvSkill, { loading: false }] as unknown as MutationTuple<
          Cvs,
          CreateCvSkillInput,
          DefaultContext,
          ApolloCache
        >
      }
      if (mutation === 'UPDATE_CV_SKILL_MUTATION') {
        return [
          mockUpdateCvSkill,
          { loading: false },
        ] as unknown as MutationTuple<
          Cvs,
          UpdateCvSkillInput,
          DefaultContext,
          ApolloCache
        >
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default values for CV_SKILL_ADD mode', () => {
    const { result } = renderHook(() => useCvSkillForm(undefined))

    expect(result.current.selectedSkill).toBeNull()
    expect(result.current.mastery).toBe('Novice')
    expect(result.current.type).toBe('CV_SKILL_ADD')
    expect(result.current.saving).toBe(false)
  })

  it('should initialize with existing skill data for CV_SKILL_EDIT mode', () => {
    mockUseModalStore.mockReturnValue({
      data: {
        id: 'cv-123',
        skill: { categoryId: 'cat-1', mastery: 'Proficient' },
      },
      type: 'CV_SKILL_EDIT',
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useCvSkillForm(mockSkillData))

    expect(result.current.selectedSkill).toEqual({ name: 'React' })
    expect(result.current.mastery).toBe('Proficient')
    expect(result.current.type).toBe('CV_SKILL_EDIT')
  })

  it('should compute availableSkills by filtering out already assigned skills', () => {
    const { result } = renderHook(() => useCvSkillForm(undefined))

    expect(result.current.availableSkills).toHaveLength(2)
    expect(result.current.availableSkills.map((s) => s.name)).not.toContain(
      'React',
    )
    expect(result.current.availableSkills.map((s) => s.name)).toContain(
      'Node.js',
    )
    expect(result.current.availableSkills.map((s) => s.name)).toContain(
      'TypeScript',
    )
  })

  it('should call addCvSkill mutation and close modal on successful submit in ADD mode', async () => {
    const { result } = renderHook(() => useCvSkillForm(undefined))

    act(() => {
      result.current.setSelectedSkill({
        name: 'Node.js',
        category: { id: 'cat-2', name: 'Backend' },
      } as unknown as Partial<unknown>)
      result.current.setMastery('Advanced')
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockAddCvSkill).toHaveBeenCalledWith({
      variables: {
        skill: {
          cvId: 'cv-123',
          name: 'Node.js',
          categoryId: 'cat-2',
          mastery: 'Advanced',
        },
      },
    })
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should call updateCvSkill mutation and close modal on successful submit in EDIT mode', async () => {
    mockUseModalStore.mockReturnValue({
      data: {
        id: 'cv-123',
        skill: { categoryId: 'cat-1', mastery: 'Proficient' },
      },
      type: 'CV_SKILL_EDIT',
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useCvSkillForm(mockSkillData))

    act(() => {
      result.current.setMastery('Advanced')
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockUpdateCvSkill).toHaveBeenCalledWith({
      variables: {
        skill: {
          cvId: 'cv-123',
          name: 'React',
          categoryId: 'cat-1',
          mastery: 'Advanced',
        },
      },
    })
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should not proceed with submit if selectedSkill is null', async () => {
    const { result } = renderHook(() => useCvSkillForm(undefined))

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockAddCvSkill).not.toHaveBeenCalled()
    expect(mockUpdateCvSkill).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should display error toast if mutation throws an error', async () => {
    mockAddCvSkill.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCvSkillForm(undefined))

    act(() => {
      result.current.setSelectedSkill({
        name: 'Node.js',
        category: { id: 'cat-2', name: 'Backend' },
      } as unknown as Partial<unknown>)
    })

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as never)
    })

    expect(mockToastError).toHaveBeenCalledWith(
      'errorOccurredError: Network error',
    )
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should correctly derive saving state from mutations', () => {
    mockUseMutation.mockImplementation((mutation: string) => {
      if (mutation === 'ADD_CV_SKILL_MUTATION') {
        return [mockAddCvSkill, { loading: true }] as unknown as MutationTuple<
          Cvs,
          CreateCvSkillInput,
          DefaultContext,
          ApolloCache
        >
      }
      return [jest.fn(), { loading: false }]
    })

    const { result } = renderHook(() => useCvSkillForm(undefined))

    expect(result.current.saving).toBe(true)
  })
})
