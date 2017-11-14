import moment from 'moment'
import { getUserAndCredentials } from './storage'
import { get } from './requests'
import pdfMakeBase from '../../../node_modules/pdfmake/build/pdfmake'
import * as pdfMakeFonts from '../../../node_modules/pdfmake/build/vfs_fonts.js'
const pdfMake = Object.assign(pdfMakeBase, pdfMakeFonts.pdfMake)

export const exportTrips = async () => {
  const [loggedIn, userAndCredentials] = getUserAndCredentials()
  if (!loggedIn) {
    return
  }
  const { user, credentials } = userAndCredentials
  const { data } = await get(`/users/${user.id}/trips`, {}, credentials)
  exportTripsToPdf(data)
}

function exportTripsToPdf(trips) {
  const rangeStart = moment().startOf('day')
  const rangeEnd = moment(rangeStart).add(1, 'month')
  const tableBody = []
  tableBody.push(['Destination', 'Start Date', 'End Date', 'Comment'])
  trips.forEach(trip => {
    if (isInRange(trip.startDate, rangeStart, rangeEnd)) {
      tableBody.push([
        trip.destination,
        formatDate(trip.startDate),
        formatDate(trip.endDate),
        trip.comment
      ])
    }
  })
  var docDefinition = {
    content: [
      {
        text: 'Travelly - Your upcoming trips',
        style: 'header' 
      },
      `** Trips starting between ${formatDate(rangeStart)} and ${formatDate(rangeEnd)}`,
      {
        style: 'tableStyle',
        table: {
          body: tableBody
        }
      },
      'Have fun!'
    ],
    styles: {
      header: {
        fontSize: 32,
        bold: true,
        margin: [0, 0, 0, 30]
      },
      tableStyle: {
        margin: [0, 5, 0, 15]
      }
    }
  }
  pdfMake.createPdf(docDefinition).print()
}

function isInRange(dateStr, rangeStart, rangeEnd) {
  const date = moment(dateStr)
  return !date.isBefore(rangeStart) && !date.isAfter(rangeEnd)
}

function formatDate(date) {
  return moment(date).format("dddd, MMMM Do YYYY")
}
