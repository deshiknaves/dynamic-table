import { ReactNode, useMemo } from 'react'
import {
  useQuery,
  QueryFunction,
  UseQueryResult,
  UseQueryOptions,
} from 'react-query'

type DataProviderReturnType<TData = unknown, TError = unknown> = UseQueryResult<
  TData,
  TError
>

type DataProviderProps<ResultType = unknown> = {
  children: (data: DataProviderReturnType<ResultType>) => ReactNode
  query: QueryFunction<ResultType>
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
  const result = useQuery<TData>(queryKey, query, {
    ...options,
    select(data) {
      const selected = options?.select ? options.select(data) : data
      return transformer ? transformer(selected) : selected
    },
  })

  return <>{children({ ...result })}</>
}
