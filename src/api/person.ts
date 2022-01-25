export type Person = {
  name: string
  age: number
  email: string
}

export function getPeople(): Promise<Person[]> {
  return fetch('/api/people/')
    .then((response) => response.json())
    .then(({ data }) => data)
}
