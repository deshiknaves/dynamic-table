import { useMemo } from 'react'
import {
  useTable,
  Column as BaseColumn,
  CellProps as BaseCellProps,
} from 'react-table'

export type Column<Type extends object> = BaseColumn<Type>

export type CellProps<CellData extends object> = BaseCellProps<CellData> & {
  onCommand: (row: Record<string, any>, command: string) => void
}

type TableProps<Data extends object> = {
  data: Data[]
  columns: Column<Data>[]
  onCommand: (
    row: Record<string, any>,
    command: string,
    data?: Record<string, any>
  ) => void
}

export function Table<DataType extends object>({
  data,
  columns,
  onCommand,
}: TableProps<DataType>): JSX.Element {
  function handleCommand(
    row: Record<string, any>,
    command: string = 'default',
    data?: any
  ) {
    onCommand(row, command, data)
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
