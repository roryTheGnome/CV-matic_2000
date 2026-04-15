import { render, screen } from '@testing-library/react'

import React from 'react'
import { Tabs } from '../Tabs'

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    style,
    className,
  }: {
    children: React.ReactNode
    href: string
    style?: React.CSSProperties
    className?: string
  }) {
    return (
      <a
        href={href}
        style={style}
        className={className}
        data-testid="mock-link"
      >
        {children}
      </a>
    )
  }
})

describe('Tabs', () => {
  const mockIsActive = jest.fn()
  const mockTabs = [
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render an empty nav when tabs are undefined', () => {
    const { container } = render(
      <Tabs tabs={undefined} isActive={mockIsActive} />,
    )

    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav?.childNodes).toHaveLength(0)
  })

  it('should render all provided tabs', () => {
    mockIsActive.mockReturnValue(false)
    render(<Tabs tabs={mockTabs} isActive={mockIsActive} />)

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getAllByTestId('mock-link')).toHaveLength(2)
  })

  it('should call isActive correctly for each tab', () => {
    mockIsActive.mockReturnValue(false)
    render(<Tabs tabs={mockTabs} isActive={mockIsActive} />)

    expect(mockIsActive).toHaveBeenCalledTimes(2)
    expect(mockIsActive).toHaveBeenCalledWith('/profile')
    expect(mockIsActive).toHaveBeenCalledWith('/settings')
  })

  it('should apply active styles to the currently active tab', () => {
    mockIsActive.mockImplementation((path: string) => path === '/profile')
    render(<Tabs tabs={mockTabs} isActive={mockIsActive} />)

    const activeLink = screen.getByText('Profile').closest('a')
    expect(activeLink).toHaveStyle({ color: 'var(--color-primary)' })

    const activeSpan = activeLink?.querySelector('span')
    expect(activeSpan).toHaveStyle({ transform: 'scaleX(1)' })
  })

  it('should apply inactive styles to inactive tabs', () => {
    mockIsActive.mockImplementation((path: string) => path === '/profile')
    render(<Tabs tabs={mockTabs} isActive={mockIsActive} />)

    const inactiveLink = screen.getByText('Settings').closest('a')
    expect(inactiveLink).toHaveStyle({ color: 'var(--color-text-secondary)' })

    const inactiveSpan = inactiveLink?.querySelector('span')
    expect(inactiveSpan).toHaveStyle({ transform: 'scaleX(0)' })
  })
})
