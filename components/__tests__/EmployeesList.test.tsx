import { render, screen } from '@testing-library/react'
import React from 'react'

import { useAuthStore } from '@/store/authStore'
import { GlobalSortKey } from '@/types/table'
import { User } from '@/types/user'
import EmployeesList from '../EmployeesList'

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

jest.mock('../admin/EmployeeActionsMenu', () => ({
  EmployeeActionsMenu: () => <div data-testid="employee-actions-menu" />,
}))

jest.mock('lucide-react', () => ({
  ChevronRight: () => <svg data-testid="chevron-right-icon" />,
  EllipsisVertical: () => <svg data-testid="ellipsis-vertical-icon" />,
}))

const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@test.com',
    department_name: 'Engineering',
    position_name: 'Frontend',
    profile: {
      first_name: 'Alice',
      last_name: 'Smith',
      avatar: '',
    },
  } as User,
  {
    id: '2',
    email: 'bob@test.com',
    department_name: 'Design',
    position_name: 'UX',
    profile: {
      first_name: 'Bob',
      last_name: 'Brown',
      avatar: '',
    },
  } as User,
  {
    id: '3',
    email: 'charlie@test.com',
    department_name: 'HR',
    position_name: 'Manager',
    profile: {
      first_name: 'Charlie',
      last_name: 'Davis',
      avatar: '',
    },
  } as User,
]

type EmployeesListProps = React.ComponentProps<typeof EmployeesList>

const renderTable = (props: EmployeesListProps) => {
  return render(
    <table>
      <EmployeesList {...props} />
    </table>,
  )
}

describe('EmployeesList', () => {
  const defaultProps: EmployeesListProps = {
    users: mockUsers,
    search: '',
    sortKey: 'first_name' as GlobalSortKey,
    sortDir: 'asc',
    currentUserId: '1',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAdmin: false,
    })
  })

  it('should render all users when search is empty', () => {
    renderTable(defaultProps)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('should filter users based on search input', () => {
    renderTable({ ...defaultProps, search: 'bob' })

    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument()
  })

  it('should filter users by full name', () => {
    renderTable({ ...defaultProps, search: 'alice smith' })

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('should render fallback string Anonymous if first_name is missing', () => {
    const userWithoutFirstName = {
      ...mockUsers[0],
      profile: { ...mockUsers[0].profile, first_name: '' },
    } as User

    renderTable({ ...defaultProps, users: [userWithoutFirstName] })

    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  it('should sort users by first_name in descending order', () => {
    const { container } = renderTable({
      ...defaultProps,
      sortKey: 'first_name',
      sortDir: 'desc',
    })
    const rows = container.querySelectorAll('tr')

    expect(rows[0].textContent).toContain('Charlie')
    expect(rows[1].textContent).toContain('Bob')
    expect(rows[2].textContent).toContain('Alice')
  })

  it('should sort users by department_name in ascending order', () => {
    const { container } = renderTable({
      ...defaultProps,
      sortKey: 'department',
      sortDir: 'asc',
    })
    const rows = container.querySelectorAll('tr')

    expect(rows[0].textContent).toContain('Design')
    expect(rows[1].textContent).toContain('Engineering')
    expect(rows[2].textContent).toContain('HR')
  })

  it('should render EmployeeActionsMenu when user is admin', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({ isAdmin: true })
    renderTable(defaultProps)

    const adminMenus = screen.getAllByTestId('employee-actions-menu')
    expect(adminMenus).toHaveLength(mockUsers.length)
    expect(screen.queryByTestId('chevron-right-icon')).not.toBeInTheDocument()
  })

  it('should render EllipsisVertical icon for the current user when not admin', () => {
    renderTable(defaultProps)

    const ellipsisIcons = screen.getAllByTestId('ellipsis-vertical-icon')
    expect(ellipsisIcons).toHaveLength(1)

    const aliceRow = screen.getByText('Alice').closest('tr')
    expect(
      aliceRow?.querySelector('[data-testid="ellipsis-vertical-icon"]'),
    ).toBeInTheDocument()
  })

  it('should render ChevronRight icon for other users when not admin', () => {
    renderTable(defaultProps)

    const chevronIcons = screen.getAllByTestId('chevron-right-icon')
    expect(chevronIcons).toHaveLength(2)

    const bobRow = screen.getByText('Bob').closest('tr')
    expect(
      bobRow?.querySelector('[data-testid="chevron-right-icon"]'),
    ).toBeInTheDocument()
  })
})
