const chai = require('chai')
const assert = chai.assert
const request = require('supertest-as-promised')
const express = require('express')
const config = require('../config')

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

  it('user should be able to retrieve and modify her own data', () => {
    let testUser = {
      username: 'someUser',
      email: 'someEmail@domain.com',
      password: 'somePassword'
    }
    let testUserId

    return doSignUp().then(doGet1).then(doPatch1)
    
    function doSignUp() {
      return request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(200)
        .then(response => testUserId = response.body.id)
    }

    function doGet1() {
      return request(app)
        .get(`/v1/user/${testUserId}`)
        .auth(testUser.username, testUser.password)
        .expect(200)
        .then(response => assert.equal(response.body.id, testUserId))
    }

    function doPatch1() {
      return request(app)
        .patch(`/v1/user/${testUserId}`)
        .auth(testUser.username, testUser.password)
        .send({ name: 'Some Other Name' })
        .expect(200)
        .then(response => assert.equal(response.body.name, 'Some Other Name'))
    }
  })

  it('admin should be able to create, retrieve and delete users successfully', () => {
    let testUser = {
      username: 'someUser',
      email: 'someEmail@domain.com',
      password: 'somePassword'
    }
    let testUserId

    return doGet1().then(doPost1).then(doGet2).then(doDelete1).then(doGet3)
    
    function doGet1() {
      return request(app)
        .get('/v1/users')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .expect(200)
        .then(response => assert.equal(response.body.length, 1))
    }

    function doPost1() {
      return request(app)
        .post('/v1/user')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .send(testUser)
        .expect(200)
        .then(response => testUserId = response.body.id)
    }

    function doGet2() {
      return request(app)
        .get('/v1/users')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .expect(200)
        .then(response => assert.equal(response.body.length, 2))
    }

    function doDelete1() {
      return request(app)
        .del(`/v1/user/${testUserId}`)
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .expect(200)
    }

    function doGet3() {
      return request(app)
        .get('/v1/users')
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .expect(200)
        .then(response => assert.equal(response.body.length, 1))
    }
  })

  it('manager should be able to create, retrieve and delete users successfully', () => {
    let managerUser = {
      username: 'someManager',
      email: 'someEmail@domain.com',
      password: 'somePassword'
    }
    let managerUserId
    let testUser = {
      username: 'someUser',
      email: 'someOtherEmail@domain.com',
      password: 'somePassword'
    }
    let testUserId

    return doSignUp1().then(doPatch1)
        .then(doGet1).then(doPost1).then(doGet2).then(doDelete1).then(doGet3)
    
    function doSignUp1() {
      return request(app)
        .post('/auth/signup')
        .send(managerUser)
        .expect(200)
        .then(response => managerUserId = response.body.id)
    }

    function doPatch1() {
      return request(app)
        .patch(`/v1/user/${managerUserId}`)
        .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
        .send({ isManager: true })
        .expect(200)
        .then(response => assert.equal(response.body.isManager, true))
    }

    function doGet1() {
      return request(app)
        .get('/v1/users')
        .auth(managerUser.username, managerUser.password)
        .expect(200)
        .then(response => assert.equal(response.body.length, 2))
    }

    function doPost1() {
      return request(app)
        .post('/v1/user')
        .auth(managerUser.username, managerUser.password)
        .send(testUser)
        .expect(200)
        .then(response => testUserId = response.body.id)
    }

    function doGet2() {
      return request(app)
        .get('/v1/users')
        .auth(managerUser.username, managerUser.password)
        .expect(200)
        .then(response => assert.equal(response.body.length, 3))
    }

    function doDelete1() {
      return request(app)
        .del(`/v1/user/${testUserId}`)
        .auth(managerUser.username, managerUser.password)
        .expect(200)
    }

    function doGet3() {
      return request(app)
        .get('/v1/users')
        .auth(managerUser.username, managerUser.password)
        .expect(200)
        .then(response => assert.equal(response.body.length, 2))
    }
  })
})
