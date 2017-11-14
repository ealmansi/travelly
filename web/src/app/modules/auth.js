import { AUTH_LOGIN, AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT, AUTH_GET_PERMISSIONS } from 'admin-on-rest'
import { post } from './requests'
import { storeLoginData, retrieveLoginData, clearLoginData } from './storage'
import HttpStatus from 'http-status-codes'
import moment from 'moment'

export default (type, params) => {
  switch (type) {
  case AUTH_LOGIN:
    return handleLogin(params)
  case AUTH_CHECK:
    return handleCheck(params)
  case AUTH_ERROR:
    return handleError(params)
  case AUTH_LOGOUT:
    return handleLogout(params)
  case AUTH_GET_PERMISSIONS:
    return handleGetPermissions(params)
  default:
    return Promise.reject()
  }
}

async function handleLogin(params) {
  const { signup, username, password } = params
  const { data: user } = signup ? await post('/auth/signup', { username, password })
                                : await post('/auth/login', {}, { username, password })
  storeLoginData(username, password, user, moment())
}

function handleCheck(params) {
  const [loggedIn, loginData] = retrieveLoginData()
  if (!loggedIn) {
    return Promise.reject()
  }
  const { username, password, user, loginTime } = loginData
  if (moment().isAfter(loginTime.clone().add(10, 'minutes'))) {
    clearLoginData()
    return Promise.reject()
  }
  storeLoginData(username, password, user, moment())
  return Promise.resolve()
}

function handleError(params) {
  const { status } = params
  if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
    clearLoginData()
    return Promise.reject()
  }
  return Promise.resolve()
}

function handleLogout(params) {
  clearLoginData()
  return Promise.resolve()
}

function handleGetPermissions(params) {
  const [loggedIn, loginData] = retrieveLoginData()
  if (!loggedIn) {
    return Promise.resolve('guest')
  }
  const { user } = loginData
  return Promise.resolve(user.role)
}
