const chai = require('chai')
const assert = chai.assert
const request = require('supertest-as-promised')
const express = require('express')
const config = require('../config')

describe('CRUD operations on trips', () => {
  let db
  let app

  before(function(done) {
    db = require('../src/db')
    app = require('../src/app')
    db.sequelize.drop().then(() => {
      db.initialize().then(() => {
        done()
      })
    })
  })
  
  after(function(done) {
    db.sequelize.close().then(() => {
      delete require.cache[require.resolve('../src/db')]
      delete require.cache[require.resolve('../src/app')]
      done()
    })
  })

  it('user should be able to create, retrieve and delete trips successfully', () => {
    let testUser = {
      username: 'someUser',
      email: 'someEmail@domain.com',
      password: 'somePassword'
    }
    let testUserId
    let testTrip = {
      destination: 'Brazil',
      startDate: '2016-01-01 00:00:00+00:00',
      endDate: '2016-02-01 00:00:00+00:00',
      comment: 'Heading out to the beach!'
    }
    let testTripId

    return doSignUp().then(doPost1).then(doGet1).then(doPatch1).then(doDelete1)
    
    function doSignUp() {
      return request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(200)
        .then(response => testUserId = response.body.id)
    }

    function doPost1() {
      return request(app)
        .post(`/v1/user/${testUserId}/trip`)
        .auth(testUser.username, testUser.password)
        .send(testTrip)
        .expect(200)
        .then(response => testTripId = response.body.id)
    }

    function doGet1() {
      return request(app)
        .get(`/v1/user/${testUserId}/trips`)
        .auth(testUser.username, testUser.password)
        .expect(200)
        .then(response => assert.equal(response.body.length, 1))
    }

    function doPatch1() {
      return request(app)
        .patch(`/v1/trip/${testTripId}`)
        .auth(testUser.username, testUser.password)
        .send({ destination: 'France' })
        .expect(200)
        .then(response => assert.equal(response.body.destination, 'France'))
    }

    function doDelete1() {
      return request(app)
        .del(`/v1/trip/${testTripId}`)
        .auth(testUser.username, testUser.password)
        .expect(200)
    }
  })

  it('admin should be able to create, retrieve and delete trips successfully', () => {
    let testTrip = {
      destination: 'Brazil',
      startDate: '2016-01-01 00:00:00+00:00',
      endDate: '2016-02-01 00:00:00+00:00',
      comment: 'Heading out to the beach!'
    }
    let testTripId

    return doGet1().then(doPost1).then(doGet2).then(doDelete1).then(doGet3)
    
    function doGet1() {
      return request(app)
        .get('/v1/trips')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => assert.equal(response.body.length, 0))
    }

    function doPost1() {
      return request(app)
        .post('/v1/trip')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .send(testTrip)
        .expect(200)
        .then(response => testTripId = response.body.id)
    }

    function doGet2() {
      return request(app)
        .get('/v1/trips')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => assert.equal(response.body.length, 1))
    }

    function doDelete1() {
      return request(app)
        .del(`/v1/trip/${testTripId}`)
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .expect(200)
    }

    function doGet3() {
      return request(app)
        .get('/v1/trips')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => assert.equal(response.body.length, 0))
    }
  })
})
