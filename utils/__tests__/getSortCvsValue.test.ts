import { Cvs } from '@/types/cvs'
import { GlobalSortKey } from '@/types/table'
import { getSortCvsValue } from '../getSortCvsValue'

describe('getSortCvsValue', () => {
  const mockCv = {
    name: 'Software Engineer',
    education: 'Bachelor of Science in Computer Science',
    user: {
      email: 'employee@example.com',
    },
  } as Cvs

  it('should return the cv name when sortKey is "cvs_name"', () => {
    expect(getSortCvsValue(mockCv, 'cvs_name' as GlobalSortKey)).toBe(
      'Software Engineer',
    )
  })

  it('should return the cv education when sortKey is "cvs_education"', () => {
    expect(getSortCvsValue(mockCv, 'cvs_education' as GlobalSortKey)).toBe(
      'Bachelor of Science in Computer Science',
    )
  })

  it('should return the user email when sortKey is "cvs_employee"', () => {
    expect(getSortCvsValue(mockCv, 'cvs_employee' as GlobalSortKey)).toBe(
      'employee@example.com',
    )
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortCvsValue(mockCv, 'invalid_key' as unknown as GlobalSortKey),
    ).toBe('')
  })
})
