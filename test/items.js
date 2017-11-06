const chai = require('chai')
const assert = chai.assert
const request = require('supertest-as-promised')
const express = require('express')
const config = require('../config')
const db = require('../src/db')
const app = require('../src/app')

describe('CRUD operations on items', () => {
  
  before(function(done) {
    db.sequelize.drop().then(() => {
      db.initialize().then(() => {
        done()
      })
    })
  })
  
  after(function(done) {
    db.sequelize.close().then(() => done())
  })

  it('should create, retrieve and delete items successfully', () => {
    const testItem = { item: 'some item' }
    return request(app)
      .post('/v1/item')
      .auth(config.get('ADMIN_USERNAME'), config.get('ADMIN_PASSWORD'))
      .send(testItem)
      .expect(200)
    .then(() => {
      return request(app)
        .get('/v1/items')
        .auth(config.get('ADMIN_USERNAME'), config.get('ADMIN_PASSWORD'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 1)
        })
    })
    .then(() => {
      return request(app)
        .del('/v1/item')
        .auth(config.get('ADMIN_USERNAME'), config.get('ADMIN_PASSWORD'))
        .query(testItem)
        .expect(200)
    })
    .then(() => {
      return request(app)
        .get('/v1/items')
        .auth(config.get('ADMIN_USERNAME'), config.get('ADMIN_PASSWORD'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 0)
        })
    })
  })
})
