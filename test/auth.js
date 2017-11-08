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

  it('admin should be able to log in successfully', () => {
    return request(app)
      .post('/auth/login')
      .auth(config.get('TEST_ADMIN_USERNAME'), config.get('TEST_ADMIN_PASSWORD'))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('user should be able to sign up and log in successfully', () => {
    let testUser = {
      username: 'someUser',
      email: 'someEmail@domain.com',
      password: 'somePassword'
    }

    return doSignUp().then(doLogIn)
    
    function doSignUp() {
      return request(app)
        .post('/auth/signup')
        .send(testUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    }

    function doLogIn() {
      return request(app)
        .post('/auth/login')
        .auth(testUser.username, testUser.password)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    }
  })
})
