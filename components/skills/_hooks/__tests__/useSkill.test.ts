import { act, renderHook } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import { SkillItem, SkillMastery } from '@/types/skills'
import { Props, useSkill } from '../useSkill'

jest.mock('../../../../store/modalStore')

const mockUseModalStore = useModalStore as unknown as jest.Mock

const mockAllSkills: SkillItem[] = [
  { id: '1', name: 'React', category_name: 'Frontend' } as unknown as SkillItem,
  { id: '2', name: 'Node', category_name: 'Backend' } as unknown as SkillItem,
]

const mockSkills: SkillMastery[] = [
  { name: 'React', categoryId: 'c1', mastery: 'Expert' } as SkillMastery,
  { name: 'UnknownSkill', categoryId: 'c2', mastery: 'Novice' } as SkillMastery,
]

describe('useSkill', () => {
  let mockOpenModal: jest.Mock
  let mockOnDelete: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockOpenModal = jest.fn()
    mockOnDelete = jest.fn()

    mockUseModalStore.mockReturnValue({
      openModal: mockOpenModal,
    })
  })

  const getDefaultProps = (): Props => ({
    skills: mockSkills,
    allSkills: mockAllSkills,
    owner: true,
    userId: 'user-123',
    cvId: 'cv-123',
    modalType: 'PROFILE_SKILL_ADD',
    onDelete: mockOnDelete,
  })

  it('initializes correctly and groups skills by category', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    expect(result.current.deleteMode).toBe(false)
    expect(result.current.selected).toEqual([])
    expect(result.current.grouped).toEqual({
      Frontend: [mockSkills[0]],
      Other: [mockSkills[1]],
    })
  })

  it('does nothing on toggleSelect if owner is false', () => {
    const props = { ...getDefaultProps(), owner: false }
    const { result } = renderHook(() => useSkill(props))

    act(() => {
      result.current.toggleSelect('React')
    })

    expect(mockOpenModal).not.toHaveBeenCalled()
    expect(result.current.selected).toEqual([])
  })

  it('does nothing on toggleSelect if skill is not found in user skills', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.toggleSelect('Node')
    })

    expect(mockOpenModal).not.toHaveBeenCalled()
  })

  it('selects and unselects skills on toggleSelect when in delete mode', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.setDeleteMode(true)
    })

    act(() => {
      result.current.toggleSelect('React')
    })

    expect(result.current.selected).toEqual(['React'])

    act(() => {
      result.current.toggleSelect('UnknownSkill')
    })

    expect(result.current.selected).toEqual(['React', 'UnknownSkill'])

    act(() => {
      result.current.toggleSelect('React')
    })

    expect(result.current.selected).toEqual(['UnknownSkill'])
  })

  it('calls openModal with PROFILE_SKILL_EDIT when toggleSelect is called outside delete mode', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.toggleSelect('React')
    })

    expect(mockOpenModal).toHaveBeenCalledWith('PROFILE_SKILL_EDIT', {
      id: 'user-123',
      skill: {
        name: 'React',
        categoryId: 'c1',
        mastery: 'Expert',
      },
    })
  })

  it('calls openModal with CV_SKILL_EDIT when toggleSelect is called outside delete mode for CVs', () => {
    const props = { ...getDefaultProps(), modalType: 'CV_SKILL_ADD' as const }
    const { result } = renderHook(() => useSkill(props))

    act(() => {
      result.current.toggleSelect('React')
    })

    expect(mockOpenModal).toHaveBeenCalledWith('CV_SKILL_EDIT', {
      id: 'cv-123',
      skill: {
        name: 'React',
        categoryId: 'c1',
        mastery: 'Expert',
      },
    })
  })

  it('sets delete mode to true when handleDelete is called and deleteMode is false', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.handleDelete()
    })

    expect(result.current.deleteMode).toBe(true)
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('does not call onDelete when handleDelete is called in deleteMode with empty selection', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.setDeleteMode(true)
    })

    act(() => {
      result.current.handleDelete()
    })

    expect(mockOnDelete).not.toHaveBeenCalled()
    expect(result.current.deleteMode).toBe(true)
  })

  it('calls onDelete, clears selection, and exits deleteMode on successful handleDelete', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.setDeleteMode(true)
      result.current.setSelected(['React'])
    })

    act(() => {
      result.current.handleDelete()
    })

    expect(mockOnDelete).toHaveBeenCalledWith(['React'])
    expect(result.current.selected).toEqual([])
    expect(result.current.deleteMode).toBe(false)
  })

  it('calls openModal with correct parameters on handleAddBtn for PROFILE', () => {
    const { result } = renderHook(() => useSkill(getDefaultProps()))

    act(() => {
      result.current.handleAddBtn()
    })

    expect(mockOpenModal).toHaveBeenCalledWith('PROFILE_SKILL_ADD', {
      id: 'user-123',
    })
  })

  it('calls openModal with correct parameters on handleAddBtn for CV', () => {
    const props = { ...getDefaultProps(), modalType: 'CV_SKILL_ADD' as const }
    const { result } = renderHook(() => useSkill(props))

    act(() => {
      result.current.handleAddBtn()
    })

    expect(mockOpenModal).toHaveBeenCalledWith('CV_SKILL_ADD', {
      id: 'cv-123',
    })
  })
})
