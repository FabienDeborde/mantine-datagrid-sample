import qs from 'qs'

type Params = {
  [key: string]: string | Params[];
}

export const getQueryParams = () => {
  const params = qs.parse(location?.search, {
    ignoreQueryPrefix: true,
    allowDots: true
  })
  return params
}

export const updateQueryParams = (queryParams: Params|Params[]) => {
  const params = getQueryParams() || {}
  // console.log('merge params', params, queryParams)

  const queryString = qs.stringify({ ...params, ...queryParams }, {
    encodeValuesOnly: true,
    skipNulls: true,
    allowDots: true
  })
  // console.log('new params', queryString)

  const newRelativeQueryPath = `${location.pathname}${queryString.startsWith('?') ? '' : '?'}${queryString}`
  history.pushState(null, '', newRelativeQueryPath)
}
