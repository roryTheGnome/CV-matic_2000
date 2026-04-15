import { fireEvent, render, screen } from '@testing-library/react'
import Cookies from 'js-cookie'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { LanguageSelect } from '../LanguageSelect'

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
  useTranslations: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: jest.fn(),
}))

jest.mock('js-cookie', () => ({
  set: jest.fn(),
}))

jest.mock('../select/Select', () => ({
  Select: ({
    children,
    handleChange,
    value,
    label,
    disabled,
  }: {
    children: React.ReactNode
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    value: string
    label: string
    disabled: boolean
  }) => (
    <div data-testid="select-wrapper">
      <label htmlFor="language-select">{label}</label>
      <select
        id="language-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        data-testid="mock-select"
      >
        {children}
      </select>
    </div>
  ),
}))

jest.mock('../select/Option', () => ({
  Option: ({ title, value }: { title: string; value: string }) => (
    <option value={value}>{title}</option>
  ),
}))

describe('LanguageSelect', () => {
  const mockRefresh = jest.fn()
  const mockStartTransition = jest.fn((cb: () => void) => cb())

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocale as jest.Mock).mockReturnValue('en')
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    ;(useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh })
    ;(useTransition as jest.Mock).mockReturnValue([false, mockStartTransition])
  })

  it('renders with the current locale value', () => {
    render(<LanguageSelect />)

    const select = screen.getByTestId('mock-select') as HTMLSelectElement
    expect(select.value).toBe('en')
    expect(screen.getByText('language')).toBeInTheDocument()
  })

  it('renders all language options', () => {
    render(<LanguageSelect />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Українська')).toBeInTheDocument()
    expect(screen.getByText('Русский')).toBeInTheDocument()
    expect(screen.getByText('German')).toBeInTheDocument()
  })

  it('updates cookie and refreshes router on change', () => {
    render(<LanguageSelect />)

    const select = screen.getByTestId('mock-select')
    fireEvent.change(select, { target: { value: 'uk' } })

    expect(Cookies.set).toHaveBeenCalledWith('USER_LOCALE', 'uk', {
      expires: 365,
    })
    expect(mockStartTransition).toHaveBeenCalled()
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('disables the select during transition', () => {
    ;(useTransition as jest.Mock).mockReturnValue([true, mockStartTransition])

    render(<LanguageSelect />)

    const select = screen.getByTestId('mock-select')
    expect(select).toBeDisabled()
  })
})
