import { User, QueryParams } from '../components/types'
import jsonData from '../mock/data.json'

export const getUsers = (params: QueryParams): Promise<User[]|Error> => {
  return new Promise((resolve, reject) => {
    const { fields, sort, order, page, limit } = params

    let data = jsonData
    if (fields) {
      for (const field of fields) {
        const { key, op, val, meta } = field
        data = data.filter((row: User) => {
          return row[key] === val
        })
      }
    }

    if (sort && order) {
      const sorted = [...data].sort((a, b) => {
        if (order === 'desc') {
          return a[sort] - b[sort]
        } else {
          return b[sort] - a[sort]
        }
      })
      data = [...sorted]
    }

    if (page && limit) {
      const end = Number(page) * Number(limit)
      const start = end - Number(limit) + 1
      const paginated = data.slice(start, end)
      data = [...paginated]
    }

    setTimeout(() => {
      console.log('resolve', data)

      resolve(jsonData)
    }, 1000)
  })
}
