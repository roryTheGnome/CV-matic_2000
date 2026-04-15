import { useModalStore } from '../modalStore'

describe('useModalStore', () => {
  const initialState = useModalStore.getState()

  beforeEach(() => {
    useModalStore.setState(initialState, true)
  })

  it('should initialize with default values', () => {
    const state = useModalStore.getState()
    expect(state.type).toBeNull()
    expect(state.isOpen).toBe(false)
    expect(state.data).toBeUndefined()
  })

  it('should open modal without data', () => {
    useModalStore.getState().openModal('USER_CREATE')
    const state = useModalStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.type).toBe('USER_CREATE')
    expect(state.data).toBeUndefined()
  })

  it('should open modal with data', () => {
    const mockData = { id: '123', name: 'Test User' }
    useModalStore.getState().openModal('USER_EDIT', mockData)
    const state = useModalStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.type).toBe('USER_EDIT')
    expect(state.data).toEqual(mockData)
  })

  it('should close modal and reset state', () => {
    useModalStore.setState({
      isOpen: true,
      type: 'USER_DELETE',
      data: { id: '999' },
    })

    useModalStore.getState().closeModal()
    const state = useModalStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.type).toBeNull()
    expect(state.data).toBeUndefined()
  })

  it('should set modal data independently', () => {
    useModalStore.setState({ isOpen: true, type: 'USER_CREATE' })
    const newData = { projectId: 'project-1' }

    useModalStore.getState().setModalData(newData)
    const state = useModalStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.type).toBe('USER_CREATE')
    expect(state.data).toEqual(newData)
  })
})
