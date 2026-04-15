import { User } from '@/types/user'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
  }: {
    src: string | { src: string }
    alt: string
  }) {
    const srcString = typeof src === 'string' ? src : src.src
    return <img src={srcString} alt={alt} />
  }
})

describe('Profile Component', () => {
  const mockUser: User = {
    id: '1',
    email: 'john.doe@example.com',
    department_name: 'Engineering',
    position_name: 'Senior Developer',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://example.com/avatar.png',
      created_at: '1672531200000',
      skills: [],
      languages: [],
    },
    role: 'user',
  } as unknown as User

  it('renders user full name and email correctly', () => {
    render(<Profile user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('renders membership date correctly', () => {
    render(<Profile user={mockUser} />)

    const expectedDate = new Date(1672531200000).toDateString()
    expect(screen.getByText(new RegExp(expectedDate))).toBeInTheDocument()
  })

  it('renders profile fields with correct values', () => {
    render(<Profile user={mockUser} />)

    expect(screen.getByText('firstName')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('lastName')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('department')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('position')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
  })

  it('renders NA when optional fields are missing', () => {
    const incompleteUser = {
      ...mockUser,
      department_name: null,
      position_name: null,
      profile: {
        ...mockUser.profile,
        first_name: '',
        last_name: '',
      },
    } as unknown as User

    render(<Profile user={incompleteUser} />)

    const naElements = screen.getAllByText('NA')
    expect(naElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders avatar with correct alt text and source', () => {
    render(<Profile user={mockUser} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
    expect(img).toHaveAttribute('alt', 'previewAvatar')
  })

  it('renders default profile image when avatar is not provided', () => {
    const userWithoutAvatar = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        avatar: null,
      },
    } as unknown as User

    render(<Profile user={userWithoutAvatar} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'previewAvatar')
    expect(img).toHaveAttribute('src', expect.stringContaining('img.jpg'))
  })
})
