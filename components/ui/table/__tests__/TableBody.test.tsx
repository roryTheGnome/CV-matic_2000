import { GlobalSortKey } from '@/types/table'
import { render, screen } from '@testing-library/react'
import TableBody from '../TableBody'

interface TestItem {
  id: number
  name: string
  age: number
}

const mockItems: TestItem[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
]

describe('TableBody', () => {
  const getSearchText = (item: TestItem): string => item.name

  const getSortValue = (
    item: TestItem,
    sortKey: GlobalSortKey,
  ): string | number | boolean => {
    const key = sortKey as string
    if (key === 'name') return item.name
    if (key === 'age') return item.age
    return ''
  }

  const renderRow = (item: TestItem, index: number) => (
    <tr key={item.id} data-testid="row">
      <td>{index}</td>
      <td>{item.name}</td>
      <td>{item.age}</td>
    </tr>
  )

  it('renders the correct number of items when no filter is applied', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search=""
          sortKey={'name' as GlobalSortKey}
          sortDir="asc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    expect(screen.getAllByTestId('row')).toHaveLength(3)
  })

  it('filters items correctly based on search string', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search="ali"
          sortKey={'name' as GlobalSortKey}
          sortDir="asc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument()
  })

  it('sorts items in ascending order', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search=""
          sortKey={'age' as GlobalSortKey}
          sortDir="asc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    const rows = screen.getAllByTestId('row')
    expect(rows[0]).toHaveTextContent('Bob')
    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Charlie')
  })

  it('sorts items in descending order', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search=""
          sortKey={'name' as GlobalSortKey}
          sortDir="desc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    const rows = screen.getAllByTestId('row')
    expect(rows[0]).toHaveTextContent('Charlie')
    expect(rows[1]).toHaveTextContent('Bob')
    expect(rows[2]).toHaveTextContent('Alice')
  })

  it('passes the correct index to renderRow after sorting and filtering', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search=""
          sortKey={'age' as GlobalSortKey}
          sortDir="desc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    const rows = screen.getAllByTestId('row')
    expect(rows[0].firstChild).toHaveTextContent('0')
    expect(rows[1].firstChild).toHaveTextContent('1')
    expect(rows[2].firstChild).toHaveTextContent('2')
  })

  it('returns empty tbody when no items match the search', () => {
    render(
      <table>
        <TableBody
          arrayOfItems={mockItems}
          search="nonexistent"
          sortKey={'name' as GlobalSortKey}
          sortDir="asc"
          getSearchText={getSearchText}
          getSortValue={getSortValue}
          renderRow={renderRow}
        />
      </table>,
    )

    expect(screen.queryByTestId('row')).not.toBeInTheDocument()
  })
})
