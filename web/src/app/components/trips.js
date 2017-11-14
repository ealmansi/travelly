import { CardActions } from 'material-ui/Card'
import { CreateButton, Filter, FunctionField, List, Responsive, SimpleList, Datagrid, SelectInput, TextField, TextInput, Create, Edit, SimpleForm, DisabledInput, DateInput, EditButton, required, ReferenceInput, ReferenceField } from 'admin-on-rest'
import { exportTrips } from '../modules/export'
import ActionPrintIcon from 'material-ui/svg-icons/action/print'
import FlatButton from 'material-ui/FlatButton'
import moment from 'moment'
import NavigationRefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import React from 'react'

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
}

const TripActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter, refresh, user }) => (
    <CardActions style={cardActionStyle}>
        {user.role === 'user' && <FlatButton primary label="Print schedule" onClick={exportTrips} icon={<ActionPrintIcon />} />}
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <FlatButton primary label="refresh" onClick={refresh} icon={<NavigationRefreshIcon />} />
    </CardActions>
)

const TripFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Destination" source="destination" defaultValue="" />
    <TextInput label="Comment" source="comment" defaultValue="" />
  </Filter>
)

export const TripList = (props) => {
  const { user } = props.options
  return (
    <List title="Trips" {...props} actions={<TripActions user={user} />} filters={<TripFilter />}>
    {
      permissions =>
        <Responsive title="Trips"
          small={
            <SimpleList
              primaryText={record => record.destination}
              secondaryText={record => record.comment || ''}
              tertiaryText={record => moment(record.startDate).fromNow()}
            />
          }
          medium={
            <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
              {
                permissions === 'admin' ?
                <TextField source="id" /> :
                null
              }
              {
                permissions === 'admin' ?
                <ReferenceField label="Traveller" reference="users" source="userId">
                  <TextField source="username" />
                </ReferenceField> :
                null
              }
              <TextField label="Destination" source="destination" />
              <FunctionField label="Start Date" source="startDate" render={record => renderStartDate(record.startDate)} />
              <FunctionField label="End Date" source="endDate" render={record => formatDate(record.endDate)} />
              <TextField label="Comment" source="comment" />
              <EditButton />
            </Datagrid>
          }
        />
    }
    </List>
  )
}

function renderStartDate(date) {
  const base = formatDate(date)
  if (isInTheFuture(date)) {
    return `${base} - ${moment(date).fromNow()}`
  }
  return base
}

function isInTheFuture(date) {
  return moment(date).isAfter(moment().startOf('day'))
}

function formatDate(date) {
  return moment(date).format("dddd, MMMM Do YYYY")
}

export const TripCreate = (props) => (
  <Create title="Create Trip" {...props}>
  {
    permissions =>
      <SimpleForm>
        {
          permissions === 'admin' ?
          <ReferenceInput label="Traveller" reference="users" source="userId" validate={required} allowEmpty>
            <SelectInput optionText="username" />
          </ReferenceInput> :
          null
        }
        <TextInput label="Destination" source="destination" validate={required} />
        <DateInput label="Start Date" source="startDate" validate={required} />
        <DateInput label="End Date" source="endDate" validate={required} />
        <TextInput label="Comment" source="comment" options={{ multiLine: true }} />
      </SimpleForm>
  }
  </Create>
)

const TripTitle = ({ record }) => {
  return <span>Trip to {record ? `"${record.destination}"` : ''}</span>
}

export const TripEdit = (props) => (
  <Edit title={<TripTitle />} {...props}>
  {
    permissions =>
      <SimpleForm>
        {
          permissions === 'admin' ?
          <DisabledInput label="Id" source="id" /> :
          null
        }
        {
          permissions === 'admin' ?
          <ReferenceInput label="Traveller" reference="users" source="userId" validate={required} allowEmpty>
            <SelectInput optionText="username" />
          </ReferenceInput> :
          null
        }
        <TextInput label="Destination" source="destination" validate={required} />
        <DateInput label="Start Date" source="startDate" validate={required} />
        <DateInput label="End Date" source="endDate" validate={required} />
        <TextInput label="Comment" source="comment" options={{ multiLine: true }} />
      </SimpleForm>
  }
  </Edit>
)
