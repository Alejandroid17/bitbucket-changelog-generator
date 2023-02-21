import CONFIGURATION from './configuration.js'

const BASE_URL_V2 = 'https://api.bitbucket.org/2.0/repositories/'

const defaultFields = ['next', 'size', 'page']
const defaultPageLen = 50

const FILTER_KEYS = {
  updateDate: 'created_on >',
  brachName: 'source.branch.name ~',
  state: 'state ='
}

const headers = {
  Accept: 'application/json',
  Authorization: `Basic ${btoa(`${CONFIGURATION.environment.username}:${CONFIGURATION.environment.appPassword}`)}`
}

async function listPullRequest (context) {
  const { q, fields } = context

  const filterList = Object.entries(q).map(item => {
    let [key, value] = item
    if (value instanceof Date) value = value.toISOString()
    return `${FILTER_KEYS[key]} "${value}"`
  })

  const queryFields = [...fields, ...defaultFields].join(',')
  const query = filterList.join(' and ')

  const url = new URL(`${BASE_URL_V2}${CONFIGURATION.environment.workspace}/${CONFIGURATION.environment.repository}`)
  url.pathname += '/pullrequests'
  url.search = new URLSearchParams({ ...context, q: query, fields: queryFields, pagelen: defaultPageLen })

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw (await response.text())
  } else {
    const data = await response.json()
    return data
  }
}

export { listPullRequest }
