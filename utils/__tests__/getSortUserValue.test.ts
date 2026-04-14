import { GlobalSortKey } from '@/types/table'
import { User } from '@/types/user'
import { getSortUserValue } from '../getSortUserValue'

describe('getSortUserValue', () => {
  const mockUser = {
    email: 'john.doe@example.com',
    department_name: 'Engineering',
    position_name: 'Frontend Developer',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
    },
  } as User

  it('should return the first name when sortKey is "first_name"', () => {
    expect(getSortUserValue(mockUser, 'first_name' as GlobalSortKey)).toBe(
      'John',
    )
  })

  it('should return the last name when sortKey is "last_name"', () => {
    expect(getSortUserValue(mockUser, 'last_name' as GlobalSortKey)).toBe('Doe')
  })

  it('should return the email when sortKey is "email"', () => {
    expect(getSortUserValue(mockUser, 'email' as GlobalSortKey)).toBe(
      'john.doe@example.com',
    )
  })

  it('should return the department name when sortKey is "department"', () => {
    expect(getSortUserValue(mockUser, 'department' as GlobalSortKey)).toBe(
      'Engineering',
    )
  })

  it('should return the position name when sortKey is "position"', () => {
    expect(getSortUserValue(mockUser, 'position' as GlobalSortKey)).toBe(
      'Frontend Developer',
    )
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortUserValue(mockUser, 'invalid_key' as unknown as GlobalSortKey),
    ).toBe('')
  })
})
