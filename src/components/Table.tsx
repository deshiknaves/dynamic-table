import { useEffect } from 'react'
import {
  useTable,
  Column as BaseColumn,
  CellProps as BaseCellProps,
  useSortBy,
  IdType,
} from 'react-table'

export type Column<Type extends object> = BaseColumn<Type>

export type CellProps<CellData extends object> = BaseCellProps<CellData> & {
  onCommand: (row: Record<string, any>, command: string) => void
}

type SortOption<Data> = {
  column?: IdType<Data>
  direction?: 'asc' | 'desc'
}

type TableProps<Data extends object> = {
  columns: Column<Data>[]
  data: Data[]
  sort?: SortOption<Data>
  onCommand: (
    row: Record<string, any>,
    command: string,
    data?: Record<string, any>
  ) => void
  onSortChange: (sort?: SortOption<Data>) => void
}

export function Table<DataType extends object>({
  columns,
  data,
  sort,
  onCommand,
  onSortChange,
}: TableProps<DataType>): JSX.Element {
  function handleCommand(
    row: Record<string, any>,
    command: string = 'default',
    data?: any
  ) {
    onCommand(row, command, data)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
      disableMultiSort: true,
      initialState: {
        sortBy: sort
          ? [{ id: sort.column as string, desc: sort.direction === 'desc' }]
          : [],
      },
    },
    useSortBy
  )

  useEffect(() => {
    if (!sortBy.length) {
      onSortChange(undefined)
      return
    }

    onSortChange({
      column: sortBy[0].id,
      direction: sortBy[0].desc ? 'desc' : 'asc',
    })
  }, [sortBy])

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr
              {...row.getRowProps()}
              onClick={() => handleCommand(row, 'on-row-click')}
            >
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell', { onCommand: handleCommand })}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
