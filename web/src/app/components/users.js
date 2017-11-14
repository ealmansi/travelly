import { Responsive, SimpleList, SingleFieldList, ChipField, Filter, List, Datagrid, SelectInput, TextField, TextInput, Create, Edit, SimpleForm, DisabledInput, ReferenceManyField, EditButton, required } from 'admin-on-rest'
import React from 'react'

const UserFilter = ({user, ...props}) => (
  <Filter {...props}>
    <TextInput label="Username" source="username" defaultValue="" />
    <SelectInput label="Role" source="role" choices={[{ id: 'user', name: 'User' }, { id: 'manager', name: 'Manager' }, { id: 'admin', name: 'Admin' }]} />
  </Filter>
)

const ConditionalEditButton = ({ user, record, ...rest }) => {
  const shouldDisplay = user.role === 'admin' ||
    (user.role === 'manager' && (user.id === record.id || record.role === 'user'))
  return [
    shouldDisplay ? <EditButton key={`edit-${record.id}`} record={record} {...rest} /> : null
  ]
}

export const UserList = (props) => {
  const { user } = props.options
  return (
    <List {...props} filters={<UserFilter user={user} />}>
    {
      permissions => {
        return (
          <Responsive
            small={
              <SimpleList
                primaryText={record => record.username}
                secondaryText={record => record.role}
                tertiaryText={record => record.id}
              />
            }
            medium={
              <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
              <TextField label="Id" source="id" />
              <TextField label="Username" source="username" />
              <TextField label="Role" source="role" />
              {
                permissions === 'admin' ?
                <ReferenceManyField label="Trips" reference="trips" target="userId">
                  <SingleFieldList>
                    <ChipField source="destination" />
                  </SingleFieldList>
                </ReferenceManyField> :
                null
              }
              <ConditionalEditButton user={user} />
            </Datagrid>
            }
          />
        )
      }
    }
    </List>
  )
}

export const UserCreate = (props) => (
  <Create {...props}>
  {
    permissions =>
      <SimpleForm>
        <TextInput label="Username" source="username" validate={required} />
        <TextInput label="Password" source="password" type="password" validate={required} />
        {
          permissions === 'admin' ? <SelectInput label="Role" source="role" choices={[{ id: 'user', name: 'User' }, { id: 'manager', name: 'Manager' }, { id: 'admin', name: 'Admin' }]} validate={required} /> :
          permissions === 'manager' ? <SelectInput label="Role" source="role" choices={[{ id: 'user', name: 'User' }]} defaultValue="user" validate={required} />
          : null
        }
      </SimpleForm>
  }
  </Create>
)

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.username}"` : ''}</span>
}

export const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
  {
    permissions =>
      <SimpleForm>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Username" source="username" />
        <TextInput label="Password" source="password" type="password" />
        {
          permissions === 'admin' ? <SelectInput label="Role" source="role" choices={[{ id: 'user', name: 'User' }, { id: 'manager', name: 'Manager' }, { id: 'admin', name: 'Admin' }]} validate={required} /> :
          permissions === 'manager' ? <SelectInput label="Role" source="role" choices={[{ id: 'user', name: 'User' }]} defaultValue="User" validate={required} />
          : null
        }
      </SimpleForm>
  }
  </Edit>
)
