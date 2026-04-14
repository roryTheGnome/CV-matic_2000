import { Project } from '@/types/project'
import { GlobalSortKey } from '@/types/table'
import { getSortProjectValue } from '../getSortProjectValue'

describe('getSortProjectValue', () => {
  const mockProject = {
    name: 'Apollo',
    domain: 'Fintech',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
  } as Project

  it('should return the project name when sortKey is "project_name"', () => {
    expect(
      getSortProjectValue(mockProject, 'project_name' as GlobalSortKey),
    ).toBe('Apollo')
  })

  it('should return the project domain when sortKey is "project_domain"', () => {
    expect(
      getSortProjectValue(mockProject, 'project_domain' as GlobalSortKey),
    ).toBe('Fintech')
  })

  it('should return the project start date when sortKey is "project_start_date"', () => {
    expect(
      getSortProjectValue(mockProject, 'project_start_date' as GlobalSortKey),
    ).toBe('2023-01-01')
  })

  it('should return the project end date when sortKey is "project_end_date"', () => {
    expect(
      getSortProjectValue(mockProject, 'project_end_date' as GlobalSortKey),
    ).toBe('2023-12-31')
  })

  it('should return an empty string when sortKey is "project_end_date" and end_date is missing', () => {
    const projectWithoutEndDate = {
      ...mockProject,
      end_date: null,
    } as unknown as Project
    expect(
      getSortProjectValue(
        projectWithoutEndDate,
        'project_end_date' as GlobalSortKey,
      ),
    ).toBe('')
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortProjectValue(
        mockProject,
        'invalid_key' as unknown as GlobalSortKey,
      ),
    ).toBe('')
  })
})
