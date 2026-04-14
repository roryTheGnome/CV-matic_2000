import { CvProject } from '@/types/cvs'
import { getExperienceYears } from '../getFirstUsed'

describe('getExperienceYears', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const mockProjects = [
    { start_date: '2022-06-01', environment: ['React', 'TypeScript'] },
    { start_date: '2019-01-15', environment: ['Node.js', 'React', 'MongoDB'] },
    { start_date: '2023-03-10', environment: ['Vue', 'TypeScript'] },
  ] as CvProject[]

  it('should return null when projects array is undefined', () => {
    expect(getExperienceYears('React', undefined)).toBeNull()
  })

  it('should return null when projects array is empty', () => {
    expect(getExperienceYears('React', [])).toBeNull()
  })

  it('should return null when the skill is not present in any project environment', () => {
    expect(getExperienceYears('Angular', mockProjects)).toBeNull()
  })

  it('should return null when projects have no environment data', () => {
    const projectsWithoutEnv = [{ start_date: '2020-01-01' }] as CvProject[]
    expect(getExperienceYears('React', projectsWithoutEnv)).toBeNull()
  })

  it('should calculate experience years based on the earliest project containing the skill', () => {
    expect(getExperienceYears('React', mockProjects)).toBe(5)
  })

  it('should calculate experience years correctly when a skill is used in only one project', () => {
    expect(getExperienceYears('Vue', mockProjects)).toBe(1)
  })

  it('should calculate experience years correctly handling chronologically unsorted data', () => {
    expect(getExperienceYears('TypeScript', mockProjects)).toBe(2)
  })
})
