import { get, post, put, del, RESTError } from './requests'
import { getUserAndCredentials } from './storage'
import HttpStatus from 'http-status-codes'

const GET_LIST = 'GET_LIST'
const GET_ONE = 'GET_ONE'
const GET_MANY = 'GET_MANY'
const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE'
const CREATE = 'CREATE'
const UPDATE = 'UPDATE'
const DELETE = 'DELETE'

const restClient = (type, resource, params) => {
  const [loggedIn, userAndCredentials] = getUserAndCredentials()
  if (!loggedIn) {
    return Promise.reject(new RESTError(HttpStatus.UNAUTHORIZED, 'Not logged in.'))
  }
  const { user, credentials } = userAndCredentials
  switch (type) {
  case GET_LIST:
    return handleGetList(resource, params, user, credentials)
  case GET_ONE:
    return handleGetOne(resource, params, user, credentials)
  case GET_MANY:
    return handleGetMany(resource, params, user, credentials)
  case GET_MANY_REFERENCE:
    return handleGetManyReference(resource, params, user, credentials)
  case CREATE:
    return handleCreate(resource, params, user, credentials)
  case UPDATE:
    return handleUpdate(resource, params, user, credentials)
  case DELETE:
    return handleDelete(resource, params, user, credentials)
  default:
    return Promise.reject()
  }
}

async function handleGetList(resource, params, user, credentials) {
  return get(`${endpoint(resource, user.id, user.role)}`, toListParams(params), credentials)
}

async function handleGetOne(resource, params, user, credentials) {
  const id = params.id
  return get(`${endpoint(resource, user.id, user.role)}/${id}`, {}, credentials)
}

async function handleGetMany(resource, params, user, credentials) {
  const ids = params.ids
  const records = await Promise.all(
    ids.map(async id => {
      const { data } = await handleGetOne(resource, { id }, user, credentials)
      return data
    })
  )
  return { data: records }
}

async function handleGetManyReference(resource, params, user, credentials) {
  const { id } = params
  return get(`/users/${id}/trips`, toListParams(params), credentials)
}

async function handleCreate(resource, params, user, credentials) {
  const data = params.data
  return post(`${endpoint(resource, user.id, user.role)}`, data, credentials)
}

async function handleUpdate(resource, params, user, credentials) {
  const { id, data } = params
  return put(`${endpoint(resource, user.id, user.role)}/${id}`, data, credentials)
}

async function handleDelete(resource, params, user, credentials) {
  const id = params.id
  return del(`${endpoint(resource, user.id, user.role)}/${id}`, {}, credentials)
}

function toListParams(params) {
  const { pagination: { page, perPage }, sort: { field, order }, filter } = params
  return {
    start: (page - 1) * perPage,
    end: page * perPage - 1,
    sort: field,
    order: order,
    filter: JSON.stringify(Object.entries(filter))
  }
}

function endpoint(resource, id, role) {
  if (resource === 'trips' && role !== 'admin') {
    return `/users/${id}/trips`
  }
  return `/${resource}`
}

export default restClient
