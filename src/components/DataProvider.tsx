import { ReactNode, useMemo, useState } from 'react'
import {
  useQuery,
  QueryFunction,
  UseQueryResult,
  UseQueryOptions,
} from 'react-query'
import qs from 'qs'

type DataProviderReturnType<TData = unknown, TError = unknown> = UseQueryResult<
  TData,
  TError
> & {
  sort?: string
  setSort: (sort: string | undefined) => void
  direction?: 'asc' | 'desc'
  setDirection: (direction: 'asc' | 'desc' | undefined) => void
}

type DataProviderProps<ResultType = unknown> = {
  children: (data: DataProviderReturnType<ResultType>) => ReactNode
  query(...args: unknown[]): Promise<ResultType>
  queryKey: string
  options?: UseQueryOptions<ResultType>
  transformer?: (data: ResultType) => ResultType
}

export function DataProvider<TData>({
  children,
  queryKey,
  query,
  options,
  transformer,
}: DataProviderProps<TData>): JSX.Element {
  const [sort, setSort] = useState<string>()
  const [direction, setDirection] = useState<'asc' | 'desc'>()
  const keys =
    Array.isArray(queryKey) && queryKey.length > 1
      ? { ...queryKey[1], sort, direction }
      : { sort, direction }

  const result = useQuery<TData>(
    [queryKey, keys],
    () => query({ query: qs.stringify({ sort, direction }) }),
    {
      ...options,
      select(data) {
        const selected = options?.select ? options.select(data) : data
        return transformer ? transformer(selected) : selected
      },
    }
  )

  return <>{children({ ...result, setSort, setDirection, sort, direction })}</>
}
