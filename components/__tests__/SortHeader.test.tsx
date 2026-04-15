import { fireEvent, render, screen } from '@testing-library/react'

import { GlobalSortKey } from '@/types/table'
import React from 'react'
import SortHeader from '../SortHeader'

jest.mock('lucide-react', () => ({
  ArrowDown: () => <svg data-testid="arrow-down" />,
  ArrowUp: () => <svg data-testid="arrow-up" />,
  ArrowUpDown: () => <svg data-testid="arrow-up-down" />,
}))

type SortHeaderProps = React.ComponentProps<typeof SortHeader>

describe('SortHeader', () => {
  const mockOnSort = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = (props: Partial<SortHeaderProps> = {}) => {
    const defaultProps: SortHeaderProps = {
      label: 'Name',
      sortKeyValue: 'first_name' as GlobalSortKey,
      currentSortKey: 'last_name' as GlobalSortKey,
      sortDir: 'asc',
      onSort: mockOnSort,
      ...props,
    }

    return render(
      <table>
        <thead>
          <tr>
            <SortHeader {...defaultProps} />
          </tr>
        </thead>
      </table>,
    )
  }

  it('should render the label correctly', () => {
    renderComponent({ label: 'Email Address' })
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('should render the default ArrowUpDown icon when inactive', () => {
    renderComponent({
      sortKeyValue: 'first_name' as GlobalSortKey,
      currentSortKey: 'last_name' as GlobalSortKey,
    })

    expect(screen.getByTestId('arrow-up-down')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument()
  })

  it('should render the ArrowUp icon when active and sortDir is asc', () => {
    renderComponent({
      sortKeyValue: 'first_name' as GlobalSortKey,
      currentSortKey: 'first_name' as GlobalSortKey,
      sortDir: 'asc',
    })

    expect(screen.getByTestId('arrow-up')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up-down')).not.toBeInTheDocument()
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument()
  })

  it('should render the ArrowDown icon when active and sortDir is desc', () => {
    renderComponent({
      sortKeyValue: 'first_name' as GlobalSortKey,
      currentSortKey: 'first_name' as GlobalSortKey,
      sortDir: 'desc',
    })

    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up-down')).not.toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
  })

  it('should call onSort with the correct sortKeyValue when clicked', () => {
    renderComponent({
      sortKeyValue: 'email' as GlobalSortKey,
    })

    const thElement = screen.getByText('Name').closest('th')

    if (thElement) {
      fireEvent.click(thElement)
    }

    expect(mockOnSort).toHaveBeenCalledTimes(1)
    expect(mockOnSort).toHaveBeenCalledWith('email')
  })
})
