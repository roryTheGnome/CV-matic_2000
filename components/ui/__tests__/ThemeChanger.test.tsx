import { fireEvent, render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import React from 'react'
import { ThemeChanger } from '../ThemeChanger'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('../select/Select', () => ({
  Select: ({
    children,
    handleChange,
    value,
    label,
  }: {
    children: React.ReactNode
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    value: string
    label: string
  }) => (
    <div>
      <label htmlFor="theme-select">{label}</label>
      <select id="theme-select" value={value} onChange={handleChange}>
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

const mockUseTheme = useTheme as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock

describe('ThemeChanger', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
    })
    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('renders with the current theme value', () => {
    render(<ThemeChanger />)

    const select = screen.getByLabelText('appearance') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('system')
  })

  it('calls setTheme when a new option is selected', () => {
    render(<ThemeChanger />)

    const select = screen.getByLabelText('appearance')
    fireEvent.change(select, { target: { value: 'dark' } })

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('displays all theme options correctly', () => {
    render(<ThemeChanger />)

    const options = screen.getAllByRole('option') as HTMLOptionElement[]

    expect(options).toHaveLength(3)
    expect(options[0].value).toBe('system')
    expect(options[0].text).toBe('System')
    expect(options[1].value).toBe('dark')
    expect(options[1].text).toBe('Dark')
    expect(options[2].value).toBe('light')
    expect(options[2].text).toBe('Light')
  })

  it('reflects theme changes from the hook', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeChanger />)

    const select = screen.getByLabelText('appearance') as HTMLSelectElement
    expect(select.value).toBe('light')
  })
})
