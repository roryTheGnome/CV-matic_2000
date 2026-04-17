import { useLazyQuery } from '@apollo/client/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { ChangeEvent } from 'react'
import { EnvironmentSelect } from '../EnvironmentSelect'
import { MultiSelectField } from '../multiSelectField/MultiSelectField'

jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useNow: () => new Date(),
  useFormatter: () => ({
    dateTime: (val: Date) => val.toISOString(),
    number: (val: number) => val.toString(),
  }),
}))
jest.mock('../multiSelectField/MultiSelectField')

describe('EnvironmentSelect', () => {
  const mockHandleChange = jest.fn()
  const mockGetPositions = jest.fn()
  const mockFormId = 'test-form'
  const mockValue = 'React,Node'

  interface MockOption {
    id: string
    name: string
  }

  interface MultiSelectProps {
    label: string
    value: string
    options: MockOption[]
    loading: boolean
    onFocus: () => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    ;(MultiSelectField as jest.Mock).mockImplementation(
      ({ label, onFocus, onChange }: MultiSelectProps) => (
        <div data-testid="multi-select-mock">
          <label>{label}</label>
          <button data-testid="focus-button" onClick={onFocus}>
            Focus
          </button>
          <input data-testid="change-input" onChange={onChange} />
        </div>
      ),
    )
  })

  it('should call getPositions on focus when not yet called', () => {
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockGetPositions,
      { data: null, loading: false, called: false },
    ])

    render(
      <EnvironmentSelect
        formId={mockFormId}
        value={mockValue}
        handleChange={mockHandleChange}
      />,
    )

    fireEvent.click(screen.getByTestId('focus-button'))
    expect(mockGetPositions).toHaveBeenCalledTimes(1)
  })

  it('should not call getPositions on focus if already called', () => {
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockGetPositions,
      { data: null, loading: false, called: true },
    ])

    render(
      <EnvironmentSelect
        formId={mockFormId}
        value={mockValue}
        handleChange={mockHandleChange}
      />,
    )

    fireEvent.click(screen.getByTestId('focus-button'))
    expect(mockGetPositions).not.toHaveBeenCalled()
  })

  it('should map positions to options correctly when data is available', () => {
    const mockData = {
      positions: [
        { id: '1', name: 'Frontend' },
        { id: '2', name: 'Backend' },
      ],
    }

    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockGetPositions,
      { data: mockData, loading: false, called: true },
    ])

    render(
      <EnvironmentSelect
        formId={mockFormId}
        value={mockValue}
        handleChange={mockHandleChange}
      />,
    )

    expect(MultiSelectField).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          { id: '1', name: 'Frontend' },
          { id: '2', name: 'Backend' },
        ],
      }),
      undefined,
    )
  })

  it('should pass correct loading state and translations to MultiSelectField', () => {
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockGetPositions,
      { data: null, loading: true, called: true },
    ])

    render(
      <EnvironmentSelect
        formId={mockFormId}
        value={mockValue}
        handleChange={mockHandleChange}
      />,
    )

    expect(MultiSelectField).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'environment',
        loading: true,
        value: mockValue,
      }),
      undefined,
    )
  })

  it('should trigger handleChange when internal field changes', () => {
    ;(useLazyQuery as unknown as jest.Mock).mockReturnValue([
      mockGetPositions,
      { data: null, loading: false, called: false },
    ])

    render(
      <EnvironmentSelect
        formId={mockFormId}
        value={mockValue}
        handleChange={mockHandleChange}
      />,
    )

    const input = screen.getByTestId('change-input')
    fireEvent.change(input, { target: { value: 'New Value' } })

    expect(mockHandleChange).toHaveBeenCalled()
  })
})
