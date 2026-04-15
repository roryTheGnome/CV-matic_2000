import { act, renderHook } from '@testing-library/react'

import { DELETE_CV_SKILL_MUTATION } from '@/api/graphql/mutations/cv'
import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { useMutation, useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import { useCvSkills } from '../useCVSkills'

jest.mock('@apollo/client/react')
jest.mock('next/navigation')

describe('useCvSkills', () => {
  const mockId = 'test-cv-id'
  const mockCvData = {
    cv: {
      id: mockId,
      skills: [{ name: 'React' }, { name: 'TypeScript' }],
    },
  }
  const mockSkillsData = {
    skills: [
      { id: '1', name: 'React' },
      { id: '2', name: 'Node.js' },
    ],
  }

  const mockDeleteSkills = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ id: mockId })

    mockDeleteSkills.mockResolvedValue({ data: { deleteCvSkill: true } })
    ;(useMutation as unknown as jest.Mock).mockReturnValue([mockDeleteSkills])
  })

  it('should return aggregated loading state when CV query is loading', () => {
    ;(useQuery as unknown as jest.Mock).mockImplementation((query) => {
      if (query === GET_CV_BY_ID) {
        return { data: undefined, loading: true, error: undefined }
      }
      return { data: mockSkillsData, loading: false, error: undefined }
    })

    const { result } = renderHook(() => useCvSkills())

    expect(result.current.loading).toBe(true)
  })

  it('should return aggregated loading state when skills query is loading', () => {
    ;(useQuery as unknown as jest.Mock).mockImplementation((query) => {
      if (query === GET_CV_BY_ID) {
        return { data: mockCvData, loading: false, error: undefined }
      }
      return { data: undefined, loading: true, error: undefined }
    })

    const { result } = renderHook(() => useCvSkills())

    expect(result.current.loading).toBe(true)
  })

  it('should return aggregated error if CV query fails', () => {
    const mockError = new Error('CV fetch failed')
    ;(useQuery as unknown as jest.Mock).mockImplementation((query) => {
      if (query === GET_CV_BY_ID) {
        return { data: undefined, loading: false, error: mockError }
      }
      return { data: mockSkillsData, loading: false, error: undefined }
    })

    const { result } = renderHook(() => useCvSkills())

    expect(result.current.error).toBe(mockError)
  })

  it('should return combined data from both queries', () => {
    ;(useQuery as unknown as jest.Mock).mockImplementation((query) => {
      if (query === GET_CV_BY_ID) {
        return { data: mockCvData, loading: false, error: undefined }
      }
      return { data: mockSkillsData, loading: false, error: undefined }
    })

    const { result } = renderHook(() => useCvSkills())

    expect(result.current.cvData).toEqual(mockCvData)
    expect(result.current.skillsData).toEqual(mockSkillsData)
    expect(result.current.id).toBe(mockId)
    expect(result.current.loading).toBe(false)
  })

  it('should call deleteSkills mutation with correct variables', async () => {
    ;(useQuery as unknown as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useCvSkills())
    const skillNames = ['React', 'TypeScript']

    await act(async () => {
      await result.current.handleDelete(skillNames)
    })

    expect(mockDeleteSkills).toHaveBeenCalledWith({
      variables: {
        skill: {
          cvId: mockId,
          name: skillNames,
        },
      },
    })
  })

  it('should setup mutation with correct refetchQueries', () => {
    ;(useQuery as unknown as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    })

    renderHook(() => useCvSkills())

    expect(useMutation).toHaveBeenCalledWith(
      DELETE_CV_SKILL_MUTATION,
      expect.objectContaining({
        refetchQueries: [
          {
            query: GET_CV_BY_ID,
            variables: { cvId: mockId },
          },
        ],
      }),
    )
  })
})
