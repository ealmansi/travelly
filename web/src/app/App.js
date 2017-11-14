import { Admin, Resource, Delete } from 'admin-on-rest'
import { deepPurple500 } from 'material-ui/styles/colors'
import { getUser } from './modules/storage'
import { TripList, TripEdit, TripCreate } from './components/trips'
import { UserList, UserCreate, UserEdit } from './components/users'
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff'
import authClient from './modules/auth'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import loginPage from './components/login'
import React from 'react'
import restClient from './modules/rest'
import UserIcon from 'material-ui/svg-icons/social/group'

const App = () => {
  return (
    <Admin title="Travelly" theme={getMuiTheme(getCustomTheme())} loginPage={loginPage} authClient={authClient} restClient={restClient}>
    {
      permissions => {
        const [loggedIn, user] = getUser()
        if (!loggedIn) {
          window.location.href = `#/login`
          return []
        }
        return [
          <Resource name="trips" options={{ label: 'Trips', user: user }} list={TripList} create={TripCreate} edit={TripEdit} remove={Delete} icon={ActionFlightTakeoff} />,
          permissions === 'manager' || permissions === 'admin' ? <Resource name="users" options={{ user: user }} list={UserList} create={UserCreate} edit={UserEdit} remove={Delete} icon={UserIcon} /> : null
        ]
      }
    }
    </Admin>
  )
}

function getCustomTheme() {
  return {
    palette: {
      primary1Color: deepPurple500,
    }
  }
}

export default App
