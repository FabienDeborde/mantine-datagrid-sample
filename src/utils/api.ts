import JsonQ from 'js-jsonq'
import { User, QueryParams } from '../components/types'
import jsonData from '../mock/data.json'

export type UserResponse = {
  results: User[];
  count: number;
}

export const getUsers = (params: QueryParams): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    let results: User[] = []
    const Q = new JsonQ({ data: jsonData })
    const query = Q.from('data')
    const { fields, sort, order, page, limit } = params

    if (fields) {
      for (const field of fields) {
        const { key, op, val, meta } = field
        query.where(key, op, val)
      }
    }

    if (sort && order) {
      query.sortBy(sort, order)
    }

    results = query.fetch()
    const count = results.length

    if (page && limit) {
      const end = Number(page) * Number(limit)
      const start = end - Number(limit) + 1
      const paginated = results.slice(start, end)
      results = [...paginated]
    }

    setTimeout(() => {
      resolve({
        results,
        count
      })
    }, 2000)
  })
}
