import { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { getPeople, Person } from './api/person'
import { DataProvider } from './components/DataProvider'
import { Table, Column, CellProps } from './components/Table'

const queryClient = new QueryClient()

function App() {
  const columns = useMemo<Column<Person>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, onCommand, row }: CellProps<Person>) => (
          <button
            type="button"
            onClick={(evt) => {
              evt.stopPropagation()
              onCommand(row.values, 'name')
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: 0,
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {value}
          </button>
        ),
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value, onCommand, row }: CellProps<Person>) => {
          return <a href={`mailto:${value}`}>{String(value)}</a>
        },
      },
    ],
    []
  )

  function handleCommand(row: Person, command: 'name' | 'email'): void {
    switch (command) {
      case 'name':
        console.log(`${row.name} is ${row.age} years old`)
        break
      default:
        console.log(row)
    }
  }

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <DataProvider
          queryKey="test"
          query={getPeople}
          transformer={(data) => {
            return data.map((person) => ({ ...person, name: 'foo' }))
          }}
        >
          {({ isLoading, data, sort, direction, setSort, setDirection }) => {
            return isLoading || !data ? (
              <p>Loading...</p>
            ) : (
              <Table
                data={data}
                columns={columns}
                sort={{ column: sort, direction }}
                onCommand={(...args) => console.log(...args)}
                onSortChange={(sort) => {
                  setSort(sort?.column)
                  setDirection(sort?.direction)
                }}
              />
            )
          }}
        </DataProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
