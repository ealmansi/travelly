import axios from 'axios'
import HttpStatus from 'http-status-codes'

export const API_BASE_URL = `${process.env.REACT_APP_API_HOST}/v1`

export const get = (path, params, auth) => {
  return rest(axios.get(`${API_BASE_URL}${path}`, { params, auth: auth }))
}

export const post = (path, data, auth) => {
  return rest(axios.post(`${API_BASE_URL}${path}`, data, { auth: auth }))
}

export const put = (path, data, auth) => {
  return rest(axios.put(`${API_BASE_URL}${path}`, data, { auth: auth }))
}

export const del = (path, params, auth) => {
  return rest(axios.delete(`${API_BASE_URL}${path}`, { params, auth: auth }))
}

function rest(promise) {
  return promise.then(handleResponse).catch(handleError)
}

function handleResponse(response) {
  return response.data
}

function handleError(error) {
  if (!error.response) {
    throw new RESTError(HttpStatus.SERVICE_UNAVAILABLE, 'Server unreachable.')
  }
  const { status, data } = error.response
  throw new RESTError(status, data.error || 'Unexpected error.')
}

export class RESTError extends Error {
  constructor(status, message) {
    super()
    this.status = status
    this.message = message
  }
}
