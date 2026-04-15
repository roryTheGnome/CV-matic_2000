import {
  CREATE_LANGUAGE_MUTATION,
  UPDATE_LANGUAGE_MUTATION,
} from '@/api/graphql/mutations/languages'
import { GET_LANGUAGES } from '@/api/graphql/queries/languages'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useLanguageActions } from '../useLanguageActions'

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

describe('useLanguageActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreateLanguage = jest.fn()
  const mockUpdateLanguage = jest.fn()

  const defaultInitialData = {
    name: 'English',
    native_name: 'English',
    iso2: 'en',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'LANGUAGE_CREATE',
      data: { id: 'lang-123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_LANGUAGE_MUTATION) {
        return [mockCreateLanguage, { loading: false }]
      }
      if (mutation === UPDATE_LANGUAGE_MUTATION) {
        return [mockUpdateLanguage, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values if no initial data is provided', () => {
    const { result } = renderHook(() => useLanguageActions())

    expect(result.current.formData).toEqual({
      name: '',
      native_name: '',
      iso2: '',
    })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() => useLanguageActions(defaultInitialData))

    expect(result.current.formData).toEqual(defaultInitialData)
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation states on input change', () => {
    const { result } = renderHook(() => useLanguageActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Spanish' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('Spanish')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should invalidate form if required fields are cleared', () => {
    const { result } = renderHook(() => useLanguageActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'iso2', value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.isFormValid).toBe(false)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() => useLanguageActions(defaultInitialData))
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreateLanguage).not.toHaveBeenCalled()
    expect(mockUpdateLanguage).not.toHaveBeenCalled()
  })

  it('should call createLanguage mutation when form is dirty and languageId is not provided', () => {
    const { result } = renderHook(() => useLanguageActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'French' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'native_name', value: 'Français' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'iso2', value: 'fr' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreateLanguage).toHaveBeenCalledWith({
      variables: {
        language: {
          name: 'French',
          native_name: 'Français',
          iso2: 'fr',
        },
      },
    })
  })

  it('should call updateLanguage mutation when form is dirty and languageId is provided', () => {
    const { result } = renderHook(() =>
      useLanguageActions(defaultInitialData, 'lang-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'iso2', value: 'gb' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateLanguage).toHaveBeenCalledWith({
      variables: {
        language: {
          languageId: 'lang-123',
          name: 'English',
          native_name: 'English',
          iso2: 'gb',
        },
      },
    })
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => useLanguageActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_LANGUAGE_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('languageCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle successful update callbacks', () => {
    renderHook(() => useLanguageActions(defaultInitialData, 'lang-123'))
    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_LANGUAGE_MUTATION,
    )[1]

    act(() => {
      updateConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('languageUpdatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => useLanguageActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_LANGUAGE_MUTATION,
    )[1]

    act(() => {
      createConfig.onError(new Error('Network error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network error')
  })

  it('should update apollo cache successfully on create', () => {
    renderHook(() => useLanguageActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_LANGUAGE_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest
        .fn()
        .mockReturnValue({ languages: [{ id: '1', name: 'Spanish' }] }),
      writeQuery: jest.fn(),
    }

    const mockData = {
      createLanguage: { id: '2', name: 'German' },
    }

    act(() => {
      createConfig.update(mockCache, { data: mockData })
    })

    expect(mockCache.readQuery).toHaveBeenCalledWith({ query: GET_LANGUAGES })
    expect(mockCache.writeQuery).toHaveBeenCalledWith({
      query: GET_LANGUAGES,
      data: {
        languages: [mockData.createLanguage, { id: '1', name: 'Spanish' }],
      },
    })
  })

  it('should not throw if cache read returns null during update', () => {
    renderHook(() => useLanguageActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_LANGUAGE_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest.fn().mockReturnValue(null),
      writeQuery: jest.fn(),
    }

    act(() => {
      createConfig.update(mockCache, {
        data: { createLanguage: { id: '2', name: 'German' } },
      })
    })

    expect(mockCache.readQuery).toHaveBeenCalled()
    expect(mockCache.writeQuery).not.toHaveBeenCalled()
  })
})
