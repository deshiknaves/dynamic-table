import { build, fake } from '@jackfranklin/test-data-bot'

const personBuilder = build('Person', {
  fields: {
    name: fake((f) => f.name.findName()),
    age: fake((f) => f.random.number({ min: 18, max: 65 })),
    email: fake((f) => f.internet.email()),
  },
})

type PersonOptions = {
  number?: number
}

export function createPeople(options: PersonOptions = {}) {
  const number = options.number || 3

  return Array(number)
    .fill(null)
    .map(() => personBuilder())
}
