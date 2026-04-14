import { CvProject } from '@/types/cvs'
import { getLastUsed } from '../getLastUsed'

describe('getLastUsed', () => {
  const mockProjects = [
    {
      start_date: '2019-01-01',
      end_date: '2020-01-01',
      environment: ['React', 'Redux'],
    },
    {
      start_date: '2021-06-01',
      end_date: '2022-12-31',
      environment: ['React', 'TypeScript'],
    },
    {
      start_date: '2018-05-01',
      end_date: '2019-05-01',
      environment: ['Vue', 'Vuex'],
    },
  ] as CvProject[]

  it('should return null when projects array is undefined', () => {
    expect(getLastUsed('React', undefined)).toBeNull()
  })

  it('should return null when projects array is empty', () => {
    expect(getLastUsed('React', [])).toBeNull()
  })

  it('should return null when the skill is not present in any project environment', () => {
    expect(getLastUsed('Angular', mockProjects)).toBeNull()
  })

  it('should return null when projects have no environment data', () => {
    const projectsWithoutEnv = [
      { start_date: '2020-01-01', end_date: '2021-01-01' },
    ] as CvProject[]

    expect(getLastUsed('React', projectsWithoutEnv)).toBeNull()
  })

  it('should return the end_date of the most recent project using the skill', () => {
    expect(getLastUsed('React', mockProjects)).toBe('2022-12-31')
  })

  it('should correctly sort and return the end_date when projects are not in chronological order', () => {
    const unsortedProjects = [
      {
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        environment: ['Node.js'],
      },
      {
        start_date: '2020-01-01',
        end_date: '2021-01-01',
        environment: ['Node.js'],
      },
      {
        start_date: '2024-01-01',
        end_date: '2024-06-01',
        environment: ['Node.js'],
      },
    ] as CvProject[]

    expect(getLastUsed('Node.js', unsortedProjects)).toBe('2024-06-01')
  })

  it('should use start_date for sorting if end_date is missing', () => {
    const projectsWithMissingEndDate = [
      {
        start_date: '2021-01-01',
        end_date: '2021-12-31',
        environment: ['Docker'],
      },
      { start_date: '2023-05-01', environment: ['Docker'] },
      {
        start_date: '2020-01-01',
        end_date: '2020-06-01',
        environment: ['Docker'],
      },
    ] as CvProject[]

    expect(getLastUsed('Docker', projectsWithMissingEndDate)).toBeUndefined()
  })
})
