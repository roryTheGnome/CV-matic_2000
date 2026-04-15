import {
  CREATE_SKILL_MUTATION,
  UPDATE_SKILL_MUTATION,
} from '@/api/graphql/mutations/skills'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useSkillActions } from '../useSkillActions'

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

describe('useSkillActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreateSkill = jest.fn()
  const mockUpdateSkill = jest.fn()

  const defaultInitialData = {
    name: 'React',
    categoryId: 'cat-1',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'SKILL_CREATE',
      data: { id: 'skill-123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_SKILL_MUTATION) {
        return [mockCreateSkill, { loading: false }]
      }
      if (mutation === UPDATE_SKILL_MUTATION) {
        return [mockUpdateSkill, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values if no initial data is provided', () => {
    const { result } = renderHook(() => useSkillActions())

    expect(result.current.formData).toEqual({
      name: '',
      categoryId: '',
    })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() => useSkillActions(defaultInitialData))

    expect(result.current.formData).toEqual(defaultInitialData)
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation states on input change', () => {
    const { result } = renderHook(() => useSkillActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Vue' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('Vue')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should invalidate form if required fields are cleared', () => {
    const { result } = renderHook(() => useSkillActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'categoryId', value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.isFormValid).toBe(false)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() => useSkillActions(defaultInitialData))
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreateSkill).not.toHaveBeenCalled()
    expect(mockUpdateSkill).not.toHaveBeenCalled()
  })

  it('should call createSkill mutation when form is dirty and skillId is not provided', () => {
    const { result } = renderHook(() => useSkillActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Angular' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'categoryId', value: 'cat-2' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreateSkill).toHaveBeenCalledWith({
      variables: {
        skill: {
          name: 'Angular',
          categoryId: 'cat-2',
        },
      },
    })
  })

  it('should call updateSkill mutation when form is dirty and skillId is provided', () => {
    const { result } = renderHook(() =>
      useSkillActions(defaultInitialData, 'skill-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'React Native' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateSkill).toHaveBeenCalledWith({
      variables: {
        skill: {
          skillId: 'skill-123',
          name: 'React Native',
          categoryId: 'cat-1',
        },
      },
    })
  })

  it('should call updateSkill mutation with empty string if modalData id is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'SKILL_EDIT',
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() =>
      useSkillActions(defaultInitialData, 'skill-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Svelte' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateSkill).toHaveBeenCalledWith({
      variables: {
        skill: {
          skillId: '',
          name: 'Svelte',
          categoryId: 'cat-1',
        },
      },
    })
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => useSkillActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_SKILL_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('skillCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle successful update callbacks', () => {
    renderHook(() => useSkillActions(defaultInitialData, 'skill-123'))
    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_SKILL_MUTATION,
    )[1]

    act(() => {
      updateConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('skillUpdatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => useSkillActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_SKILL_MUTATION,
    )[1]

    act(() => {
      createConfig.onError(new Error('Network error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network error')
  })

  it('should update apollo cache successfully on create', () => {
    renderHook(() => useSkillActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_SKILL_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest
        .fn()
        .mockReturnValue({ skills: [{ id: '1', name: 'TypeScript' }] }),
      writeQuery: jest.fn(),
    }

    const mockData = {
      createSkill: { id: '2', name: 'GraphQL' },
    }

    act(() => {
      createConfig.update(mockCache, { data: mockData })
    })

    expect(mockCache.readQuery).toHaveBeenCalledWith({ query: GET_SKILLS })
    expect(mockCache.writeQuery).toHaveBeenCalledWith({
      query: GET_SKILLS,
      data: {
        skills: [mockData.createSkill, { id: '1', name: 'TypeScript' }],
      },
    })
  })

  it('should not throw if cache read returns null during update', () => {
    renderHook(() => useSkillActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_SKILL_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest.fn().mockReturnValue(null),
      writeQuery: jest.fn(),
    }

    act(() => {
      createConfig.update(mockCache, {
        data: { createSkill: { id: '2', name: 'GraphQL' } },
      })
    })

    expect(mockCache.readQuery).toHaveBeenCalled()
    expect(mockCache.writeQuery).not.toHaveBeenCalled()
  })
})
