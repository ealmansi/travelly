import moment from 'moment'

export const storeLoginData = (username, password, user, loginTime) => {
  localStorage.setItem('username', username)
  localStorage.setItem('password', password)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('loginTime', loginTime.format())
}

export const retrieveLoginData = () => {
  try {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    const user = JSON.parse(localStorage.getItem('user'))
    const loginTime = moment(localStorage.getItem('loginTime'))
    const loggedIn = username && password && user && loginTime && true
    return [loggedIn, { username, password, user, loginTime }]
  }
  catch (err) {
    return [false, null]
  }
}

export const clearLoginData = () => {
  localStorage.removeItem('username')
  localStorage.removeItem('password')
  localStorage.removeItem('user')
  localStorage.removeItem('loginTime')
}

export const getUserAndCredentials = () => {
  const [loggedIn, loginData] = retrieveLoginData()
  if (!loggedIn) {
    return [false, null]
  }
  const { user, username, password } = loginData
  return [true, { user, credentials: { username, password } }]
}

export const getUser = () => {
  const [loggedIn, loginData] = retrieveLoginData()
  if (!loggedIn) {
    return [false, null]
  }
  const { user } = loginData
  return [true, user]
}
