import { act, renderHook } from '@testing-library/react'

import { PRIVATE_ROUTES } from '@/config/routes'
import { ModalData, ModalType, useModalStore } from '@/store/modalStore'
import { useRouter } from 'next/navigation'
import { useActionMenu } from '../useActionMenu'

jest.mock('../../../config/routes.ts', () => ({
  PRIVATE_ROUTES: {
    CVS: '/cvs',
  },
}))
jest.mock('../../../store/modalStore.ts')
jest.mock('next/navigation')

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseRouter = useRouter as jest.Mock

const mockItem: ModalData = { id: 'item-123' } as unknown as ModalData
const mockDeleteType: ModalType = 'delete' as unknown as ModalType
const mockEditType: ModalType = 'edit' as unknown as ModalType

describe('useActionMenu', () => {
  let mockOpenModal: jest.Mock
  let mockPush: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockOpenModal = jest.fn()
    mockPush = jest.fn()

    mockUseModalStore.mockReturnValue({
      openModal: mockOpenModal,
    })

    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
  })

  it('should initialize with isOpen set to false', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    expect(result.current.isOpen).toBe(false)
    expect(result.current.menuRef.current).toBeNull()
  })

  it('should allow toggling isOpen state', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.setIsOpen(true)
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.setIsOpen(false)
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('should call openModal with editType and item, and close the menu on handleEdit', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.setIsOpen(true)
    })

    act(() => {
      result.current.handleEdit()
    })

    expect(mockOpenModal).toHaveBeenCalledWith(mockEditType, mockItem)
    expect(result.current.isOpen).toBe(false)
  })

  it('should call openModal with deleteType and item, and close the menu on handleDelete', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.setIsOpen(true)
    })

    act(() => {
      result.current.handleDelete()
    })

    expect(mockOpenModal).toHaveBeenCalledWith(mockDeleteType, mockItem)
    expect(result.current.isOpen).toBe(false)
  })

  it('should call router.push with correct path on handleCvDetails', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.handleCvDetails('cv-456')
    })

    expect(mockPush).toHaveBeenCalledWith(`${PRIVATE_ROUTES.CVS}/cv-456`)
  })

  it('should close the menu when clicking outside the menuRef element', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.setIsOpen(true)
    })

    const menuElement = document.createElement('div')
    Object.defineProperty(result.current.menuRef, 'current', {
      value: menuElement,
      writable: true,
    })

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      outsideElement.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(false)

    document.body.removeChild(outsideElement)
  })

  it('should not close the menu when clicking inside the menuRef element', () => {
    const { result } = renderHook(() =>
      useActionMenu(mockDeleteType, mockEditType, mockItem),
    )

    act(() => {
      result.current.setIsOpen(true)
    })

    const menuElement = document.createElement('div')
    Object.defineProperty(result.current.menuRef, 'current', {
      value: menuElement,
      writable: true,
    })

    const insideElement = document.createElement('span')
    menuElement.appendChild(insideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      insideElement.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(true)
  })
})
