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

let testUser = {
  username: 'someUsername',
  password: 'somePassword'
}

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

  it('user should be able to sign up and log in successfully', () => {
    return signUp().then(logIn)

    function signUp() {
      return request(app)
      .post('/v1/auth/signup').send(testUser)
      .expect(HttpStatus.OK)
      .then(response => {
        assert.equal(response.body.data.username, testUser.username)
        assert.equal(response.body.data.role, 'user')
      })
    }

    function logIn() {
      return request(app)
      .post('/v1/auth/login').auth(testUser.username, testUser.password)
      .expect(HttpStatus.OK)
    }
  })

  it('admin should be able to log in successfully', () => {
    return request(app)
    .post('/v1/auth/login')
    .auth(testAdmin.username, testAdmin.password)
    .expect(HttpStatus.OK)
    .then(response => {
      assert.equal(response.body.data.username, testAdmin.username)
      assert.equal(response.body.data.role, 'admin')
    })
  })
})
