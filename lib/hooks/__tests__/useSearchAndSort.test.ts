import { User } from '@/types/user'
import { useUsersSearchAndSort } from '../useSerchAndSort'

const mockUsers: User[] = [
  {
    profile: { first_name: 'Charlie', last_name: 'Brown' },
    email: 'charlie@example.com',
    department_name: 'Sales',
    position_name: 'Manager',
  } as User,
  {
    profile: { first_name: 'Alice', last_name: 'Smith' },
    email: 'alice@example.com',
    department_name: 'Engineering',
    position_name: 'Developer',
  } as User,
  {
    profile: { first_name: 'Bob', last_name: 'Jones' },
    email: 'bob@example.com',
    department_name: 'HR',
    position_name: 'Recruiter',
  } as User,
  {
    profile: { first_name: 'Aaron', last_name: 'Smith' },
    email: 'aaron@example.com',
    department_name: 'Engineering',
    position_name: 'Analyst',
  } as User,
]

describe('useUsersSearchAndSort', () => {
  it('should return all users sorted by first_name ascending when search is empty', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'first_name', 'asc')

    expect(result).toHaveLength(4)
    expect(result[0].profile.first_name).toBe('Aaron')
    expect(result[1].profile.first_name).toBe('Alice')
    expect(result[2].profile.first_name).toBe('Bob')
    expect(result[3].profile.first_name).toBe('Charlie')
  })

  it('should filter users by full name case-insensitively', () => {
    const result = useUsersSearchAndSort(
      mockUsers,
      'alice Smi',
      'first_name',
      'asc',
    )

    expect(result).toHaveLength(1)
    expect(result[0].profile.first_name).toBe('Alice')
  })

  it('should filter users correctly when search matches multiple entries', () => {
    const result = useUsersSearchAndSort(
      mockUsers,
      'smith',
      'first_name',
      'asc',
    )

    expect(result).toHaveLength(2)
    expect(result[0].profile.first_name).toBe('Aaron')
    expect(result[1].profile.first_name).toBe('Alice')
  })

  it('should return an empty array if no users match the search query', () => {
    const result = useUsersSearchAndSort(mockUsers, 'xyz', 'first_name', 'asc')

    expect(result).toHaveLength(0)
  })

  it('should sort users by first_name descending', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'first_name', 'desc')

    expect(result[0].profile.first_name).toBe('Charlie')
    expect(result[1].profile.first_name).toBe('Bob')
    expect(result[2].profile.first_name).toBe('Alice')
    expect(result[3].profile.first_name).toBe('Aaron')
  })

  it('should sort users by last_name ascending', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'last_name', 'asc')

    expect(result[0].profile.last_name).toBe('Brown')
    expect(result[1].profile.last_name).toBe('Jones')
    expect(result[2].profile.last_name).toBe('Smith')
    expect(result[3].profile.last_name).toBe('Smith')
  })

  it('should sort users by email descending', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'email', 'desc')

    expect(result[0].email).toBe('charlie@example.com')
    expect(result[1].email).toBe('bob@example.com')
    expect(result[2].email).toBe('alice@example.com')
    expect(result[3].email).toBe('aaron@example.com')
  })

  it('should sort users by department ascending', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'department', 'asc')

    expect(result[0].department_name).toBe('Engineering')
    expect(result[1].department_name).toBe('Engineering')
    expect(result[2].department_name).toBe('HR')
    expect(result[3].department_name).toBe('Sales')
  })

  it('should sort users by position descending', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'position', 'desc')

    expect(result[0].position_name).toBe('Recruiter')
    expect(result[1].position_name).toBe('Manager')
    expect(result[2].position_name).toBe('Developer')
    expect(result[3].position_name).toBe('Analyst')
  })

  it('should handle identical values without throwing errors', () => {
    const identicalUsers: User[] = [
      { profile: { first_name: 'John', last_name: 'Doe' } } as User,
      { profile: { first_name: 'John', last_name: 'Doe' } } as User,
    ]

    const result = useUsersSearchAndSort(
      identicalUsers,
      '',
      'first_name',
      'asc',
    )

    expect(result).toHaveLength(2)
    expect(result[0].profile.first_name).toBe('John')
    expect(result[1].profile.first_name).toBe('John')
  })

  it('should maintain original order if sortKey is unknown', () => {
    const result = useUsersSearchAndSort(mockUsers, '', 'unknown_key', 'asc')

    expect(result[0].profile.first_name).toBe('Charlie')
    expect(result[1].profile.first_name).toBe('Alice')
    expect(result[2].profile.first_name).toBe('Bob')
    expect(result[3].profile.first_name).toBe('Aaron')
  })
})
