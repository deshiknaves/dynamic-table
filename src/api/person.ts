export type Person = {
  name: string
  age: number
  email: string
}

type PersonOptions = {
  query?: string
}

export function getPeople({ query }: PersonOptions): Promise<Person[]> {
  return fetch(`/api/people?${query}`)
    .then((response) => response.json())
    .then(({ data }) => data)
}
