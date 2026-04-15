import { render, screen } from '@testing-library/react'

import { usePathname } from 'next/navigation'
import React from 'react'
import GlobalNav from '../GlobalNav'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

jest.mock('../../../components/navs/Breadcrumbs/UsersNav', () => {
  return function MockUsersNav() {
    return <div data-testid="users-nav" />
  }
})

jest.mock('../../../components/navs/Breadcrumbs/ProjectsNav', () => {
  return function MockProjectsNav() {
    return <div data-testid="projects-nav" />
  }
})

jest.mock('../../../components/navs/Breadcrumbs/CvNav', () => {
  return function MockCvNav() {
    return <div data-testid="cv-nav" />
  }
})

describe('GlobalNav', () => {
  const mockUsePathname = usePathname as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the "Employees" label and UsersNav when path starts with /users', () => {
    mockUsePathname.mockReturnValue('/users/123')
    render(<GlobalNav />)

    const link = screen.getByRole('link', { name: 'Employees' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/users')
    expect(screen.getByTestId('users-nav')).toBeInTheDocument()
    expect(screen.queryByTestId('projects-nav')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cv-nav')).not.toBeInTheDocument()
  })

  it('should render the "Projects" label and ProjectsNav when path starts with /projects', () => {
    mockUsePathname.mockReturnValue('/projects/alpha')
    render(<GlobalNav />)

    const link = screen.getByRole('link', { name: 'Projects' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/projects')
    expect(screen.getByTestId('projects-nav')).toBeInTheDocument()
    expect(screen.queryByTestId('users-nav')).not.toBeInTheDocument()
  })

  it('should render the "CVs" label and CvNav when path starts with /cvs', () => {
    mockUsePathname.mockReturnValue('/cvs/edit/1')
    render(<GlobalNav />)

    const link = screen.getByRole('link', { name: 'CVs' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/cvs')
    expect(screen.getByTestId('cv-nav')).toBeInTheDocument()
  })

  it('should render the raw segment name if no label is found in ROUTE_LABELS', () => {
    mockUsePathname.mockReturnValue('/unknown-route/something')
    render(<GlobalNav />)

    const link = screen.getByRole('link', { name: 'unknown-route' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/unknown-route')
    expect(screen.queryByTestId('users-nav')).not.toBeInTheDocument()
    expect(screen.queryByTestId('projects-nav')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cv-nav')).not.toBeInTheDocument()
  })

  it('should render labels from ROUTE_LABELS correctly for other segments', () => {
    mockUsePathname.mockReturnValue('/languages')
    render(<GlobalNav />)

    expect(screen.getByRole('link', { name: 'Languages' })).toBeInTheDocument()
  })
})
