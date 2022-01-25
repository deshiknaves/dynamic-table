import { rest } from 'msw'
import { createPeople } from './generators'

export const handlers = [
  rest.get('/api/people', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: createPeople() }))
  }),
]
