import { Cvs } from '@/types/cvs'
import { render, screen } from '@testing-library/react'
import { CvTableItem } from '../CvTableItem'

jest.mock('../../../../components/admin/ActionsMenu', () => ({
  ActionsMenu: ({
    editType,
    deleteType,
    item,
    cvId,
  }: {
    editType: string | null
    deleteType: string
    item: { id: string; name: string }
    cvId: string
  }) => (
    <div data-testid="actions-menu">
      <span>Edit: {String(editType)}</span>
      <span>Delete: {deleteType}</span>
      <span>
        Item: {item.id} - {item.name}
      </span>
      <span>CV ID: {cvId}</span>
    </div>
  ),
}))

describe('CvTableItem', () => {
  const mockCv: Cvs = {
    id: 'cv-123',
    name: 'Frontend Developer CV',
    education: 'Bachelor of Computer Science',
    user: {
      email: 'john.doe@example.com',
    },
  } as Cvs

  it('should render cv information correctly in table cells', () => {
    render(
      <table>
        <tbody>
          <CvTableItem cv={mockCv} />
        </tbody>
      </table>,
    )

    expect(screen.getByText('Frontend Developer CV')).toBeInTheDocument()
    expect(screen.getByText('Bachelor of Computer Science')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('should pass correct props to ActionsMenu component', () => {
    render(
      <table>
        <tbody>
          <CvTableItem cv={mockCv} />
        </tbody>
      </table>,
    )

    expect(screen.getByTestId('actions-menu')).toBeInTheDocument()
    expect(screen.getByText('Edit: null')).toBeInTheDocument()
    expect(screen.getByText('Delete: CV_DELETE')).toBeInTheDocument()
    expect(
      screen.getByText('Item: cv-123 - Frontend Developer CV'),
    ).toBeInTheDocument()
    expect(screen.getByText('CV ID: cv-123')).toBeInTheDocument()
  })
})
