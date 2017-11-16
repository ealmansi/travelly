const HttpStatus = require('http-status-codes')
const chai = require('chai')
const assert = chai.assert
const request = require('supertest-as-promised')
const express = require('express')
const config = require('../config')

const testAdmin = {
  username: config.get('TEST_ADMIN_USERNAME'),
  password: config.get('TEST_ADMIN_PASSWORD')
}

const testManager = {
  username: 'someManager',
  password: 'somePassword',
  role: 'manager'
}

const testUser = {
  username: 'someUsername',
  password: 'somePassword',
  role: 'user'
}

describe('CRUD operations on users', () => {
  let db
  let app

  beforeEach(function(done) {
    db = require('../src/db')
    app = require('../src/app')
    db.sequelize.drop().then(() => {
      db.initialize().then(() => {
        done()
      })
    })
  })
  
  afterEach(function(done) {
    db.sequelize.close().then(() => {
      delete require.cache[require.resolve('../src/db')]
      delete require.cache[require.resolve('../src/app')]
      done()
    })
  })

  it('admin should be able to create, retrieve, update and delete users successfully', () => {
    let testUserId

    return getUsers()
    .then(createUser).then(getUser1)
    .then(updateUser).then(getUser2)
    .then(deleteUser).then(getUser3)

    function getUsers() {
      return request(app)
      .get('/v1/users').auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.length, 1)
      })
    }

    function createUser() {
      return request(app)
      .post('/v1/users').auth(testAdmin.username, testAdmin.password).send(testUser)
      .expect(HttpStatus.OK)
      .then(response => {
        testUserId = response.body.data.id
      })
    }

    function getUser1() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, testUser.username)
      })
    }

    function updateUser() {
      const updatedTestUser = Object.assign({}, testUser, { username: 'someOtherUsername' })
      return request(app)
      .put(`/v1/users/${testUserId}`).auth(testAdmin.username, testAdmin.password).send(updatedTestUser)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, updatedTestUser.username)
      })
    }

    function getUser2() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.id, testUserId)
      })
    }

    function deleteUser() {
      return request(app)
      .delete(`/v1/users/${testUserId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
    }

    function getUser3() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.NOT_FOUND)
    }
  })

  it('manager should be able to create, retrieve, update and delete users successfully', () => {
    let testManagerId
    let testUserId

    return createManager()
    .then(createUser).then(getUser1)
    .then(updateUser).then(getUser2)
    .then(deleteUser).then(getUser3)

    function createManager() {
      return request(app)
      .post('/v1/users').auth(testAdmin.username, testAdmin.password).send(testManager)
      .expect(HttpStatus.OK)
      .then(response => {
        testManagerId = response.body.data.id
      })
    }

    function createUser() {
      return request(app)
      .post('/v1/users').auth(testManager.username, testManager.password).send(testUser)
      .expect(HttpStatus.OK)
      .then(response => {
        testUserId = response.body.data.id
      })
    }

    function getUser1() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testManager.username, testManager.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, testUser.username)
      })
    }

    function updateUser() {
      const updatedTestUser = Object.assign({}, testUser, { username: 'someOtherUsername' })
      return request(app)
      .put(`/v1/users/${testUserId}`).auth(testManager.username, testManager.password).send(updatedTestUser)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, updatedTestUser.username)
      })
    }

    function getUser2() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testManager.username, testManager.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.id, testUserId)
      })
    }

    function deleteUser() {
      return request(app)
      .delete(`/v1/users/${testUserId}`).auth(testManager.username, testManager.password)
      .expect(HttpStatus.OK)
    }

    function getUser3() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testManager.username, testManager.password)
      .expect(HttpStatus.NOT_FOUND)
    }
  })

  it('user should be able to retrieve and update her own data successfully', () => {
    let testUserId
    let updatedTestUser

    return createUser()
    .then(getUser1).then(updateUser).then(getUser2)

    function createUser() {
      return request(app)
      .post('/v1/users').auth(testAdmin.username, testAdmin.password).send(testUser)
      .expect(HttpStatus.OK)
      .then(response => {
        testUserId = response.body.data.id
      })
    }

    function getUser1() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(testUser.username, testUser.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, testUser.username)
      })
    }

    function updateUser() {
      updatedTestUser = Object.assign({}, testUser, { username: 'someOtherUsername' })
      return request(app)
      .put(`/v1/users/${testUserId}`).auth(testUser.username, testUser.password).send(updatedTestUser)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, updatedTestUser.username)
      })
    }

    function getUser2() {
      return request(app)
      .get(`/v1/users/${testUserId}`).auth(updatedTestUser.username, updatedTestUser.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.id, testUserId)
      })
    }
  })
})
