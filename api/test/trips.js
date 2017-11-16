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

const adminTestTrip = {
  destination: 'some destination for admin',
  startDate: '1970/01/01',
  endDate: '1970/01/02',
  comment: 'some comment from admin',
  userId: 1
}

const testUser = {
  username: 'someUsername',
  password: 'somePassword',
  role: 'user'
}

const userTestTrip = {
  destination: 'some destination for user',
  startDate: '1970/01/01',
  endDate: '1970/01/02',
  comment: 'some comment from user'
}

describe('CRUD operations on trips', () => {
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

  it('admin should be able to create, retrieve, update and delete trips successfully', () => {
    let adminTestTripId

    return getTrips()
    .then(createTrip).then(getTrip1)
    .then(updateTrip).then(getTrip2)
    .then(deleteTrip).then(getTrip3)
    .then(createTrip2).then(getTrip4)

    function getTrips() {
      return request(app)
      .get('/v1/trips').auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.length, 0)
      })
    }

    function createTrip() {
      return request(app)
      .post('/v1/trips').auth(testAdmin.username, testAdmin.password).send(adminTestTrip)
      .expect(HttpStatus.OK).then(response => {
        console.log(response.body.data)
        adminTestTripId = response.body.data.id
      })
    }

    function getTrip1() {
      console.log(adminTestTripId)
      return request(app)
      .get(`/v1/trips/${adminTestTripId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.destination, adminTestTrip.destination)
      })
    }

    function updateTrip() {
      const updatedTestTrip = Object.assign({}, adminTestTrip, { comment: 'someOtherComment' })
      return request(app)
      .put(`/v1/trips/${adminTestTripId}`).auth(testAdmin.username, testAdmin.password).send(updatedTestTrip)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.comment, updatedTestTrip.comment)
      })
    }

    function getTrip2() {
      return request(app)
      .get(`/v1/trips/${adminTestTripId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.id, adminTestTripId)
      })
    }

    function deleteTrip() {
      return request(app)
      .delete(`/v1/trips/${adminTestTripId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
    }

    function getTrip3() {
      return request(app)
      .get(`/v1/trips/${adminTestTripId}`).auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.NOT_FOUND)
    }

    function createTrip2() {
      return request(app)
      .post('/v1/users/1/trips').auth(testAdmin.username, testAdmin.password).send(adminTestTrip)
      .expect(HttpStatus.OK).then(response => {
        console.log(response.body.data)
        adminTestTripId = response.body.data.id
      })
    }

    function getTrip4() {
      return request(app)
      .get('/v1/users/1/trips').auth(testAdmin.username, testAdmin.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.length, 1)
      })
    }
  })

  it('user should be able to retrieve and update her own trips successfully', () => {
    let testUserId
    let userTestTripId

    return createUser()
    .then(createTrip)//.then(getTrip1).then(updateTrip).then(deleteTrip).then(getTrip2)

    function createUser() {
      return request(app)
      .post('/v1/users').auth(testAdmin.username, testAdmin.password).send(testUser)
      .expect(HttpStatus.OK).then(response => {
        console.log(response.body.data)
        testUserId = response.body.data.id
      })
      .then(() => userTestTrip.userId = testUserId)
    }

    function createTrip() {
      return request(app)
      .post(`/v1/users/${testUserId}/trips`).auth(testUser.username, testUser.password).send(userTestTrip)
      .expect(HttpStatus.OK).then(response => {
        console.log(response.body.data)
        userTestTripId = response.body.data.id
      })
    }

    function getTrip1() {
      return request(app)
      .get(`/v1/users/${testUserId}/trips/${userTestTripId}`).auth(testUser.username, testUser.password)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.destination, userTestTrip.destination)
      })
    }

    function updateTrip() {
      const updatedTestTrip = Object.assign({}, userTestTrip, { comment: 'someOtherComment' })
      return request(app)
      .put(`/v1/trips/${userTestTripId}`).auth(testUser.username, testUser.password).send(updatedTestTrip)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.comment, updatedTestTrip.comment)
      })
    }

    function deleteTrip() {
      return request(app)
      .delete(`/v1/trips/${userTestTripId}`).auth(testUser.username, testUser.password)
      .expect(HttpStatus.OK)
    }

    function getTrip2() {
      return request(app)
      .get(`/v1/trips/${userTestTripId}`).auth(testUser.username, testUser.password)
      .expect(HttpStatus.NOT_FOUND)
    }
  })
})
