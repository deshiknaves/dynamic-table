import { rest } from 'msw'
import { createPeople } from './generators'
import orderBy from 'lodash/orderBy'

const pages = [
  createPeople({ number: 25 }),
  createPeople({ number: 25 }),
  createPeople({ number: 25 }),
]

export const handlers = [
  rest.get('/api/people', (req, res, ctx) => {
    const sort = req.url.searchParams.get('sort')
    const direction =
      (req.url.searchParams.get('direction') as 'asc' | 'desc') || 'asc'

    return res(
      ctx.status(200),
      ctx.json({
        data: sort ? orderBy(pages[0], [sort], [direction]) : pages[0],
      })
    )
  }),
]
