require('dotenv').config()
const chai = require('chai')
const assert = chai.assert
const request = require('supertest-as-promised')
const express = require('express')
const db = require('../src/db')
const app = require('../src/app')

describe('CRUD operations on items', () => {
  
  before(function(done) {
    db.sequelize.sync({ force: true }).then(() => done())
  })
  
  after(function(done) {
    db.sequelize.close().then(() => done())
  })

  it('should create, retrieve and delete items successfully', () => {
    const testItem = { item: 'some item' }
    return request(app)
      .post('/item')
      .send(testItem)
      .expect(200)
    .then(() => {
      return request(app)
        .get('/items')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 1)
        })
    })
    .then(() => {
      return request(app)
        .del('/item')
        .query(testItem)
        .expect(200)
    })
    .then(() => {
      return request(app)
        .get('/items')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 0)
        })
    })
  })
})
