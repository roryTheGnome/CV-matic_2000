import { render, screen } from '@testing-library/react'

import { useDeleteCv } from '@/lib/hooks/cvHooks/useDeleteCv'
import { DeleteCvModal } from '../DeleteCvModal'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('../../../../lib/hooks/cvHooks/useDeleteCv')

jest.mock('../../DeleteModal', () => ({
  DeleteModal: ({
    deleteText,
    headingText,
    loading,
  }: {
    deleteText: string
    headingText: string
    loading: boolean
  }) => (
    <div data-testid="mock-delete-modal">
      <span data-testid="delete-text">{deleteText}</span>
      <span data-testid="heading-text">{headingText}</span>
      <span data-testid="loading-state">{loading.toString()}</span>
    </div>
  ),
}))

describe('DeleteCvModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should pass correct props to DeleteModal', () => {
    ;(useDeleteCv as jest.Mock).mockReturnValue({
      modalData: { name: 'Frontend Developer' },
      loading: false,
      closeModal: jest.fn(),
      handleDelete: jest.fn(),
    })

    render(<DeleteCvModal />)

    expect(screen.getByTestId('mock-delete-modal')).toBeInTheDocument()
    expect(screen.getByTestId('heading-text')).toHaveTextContent('CV')
    expect(screen.getByTestId('delete-text')).toHaveTextContent(
      'CV Frontend Developer',
    )
    expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
  })

  it('should handle undefined modalData safely', () => {
    ;(useDeleteCv as jest.Mock).mockReturnValue({
      modalData: null,
      loading: true,
      closeModal: jest.fn(),
      handleDelete: jest.fn(),
    })

    render(<DeleteCvModal />)

    expect(screen.getByTestId('delete-text')).toHaveTextContent('CV undefined')
    expect(screen.getByTestId('loading-state')).toHaveTextContent('true')
  })
})
