const util = require('../../util')
const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const assert = chai.assert
const expect = chai.expect
chai.should()
chai.use(chaiAsPromised)

describe('v1 items route unit tests', function() {
  let db
  let getRequestHandler
  
  beforeEach(function(done) {
    db = require('../../db')
    db.sequelize.sync().then(() => {
      const api = require('../../../src/api/v1')(db)
      getRequestHandler = util.getRequestHandlerFromApi(api)
      done()
    })
  })

  afterEach(function(done) {
    db.sequelize.drop().then(() => {
      delete require.cache[require.resolve('../../db')]
      done()
    })
  })

  it('post request should fail on invalid input', done => {
    const req = { body: { } }
    const res = {
      sendStatus: status => {
        expect(status).to.equal(422)
        done()
      }
    }
    getRequestHandler('POST /item')(req, res)
  })

  it('post request should fail on database failure', done => {
    const req = { body: { item: 'some item' } }
    const res = {
      sendStatus: status => {
        expect(status).to.equal(500)
        done()
      }
    }
    const create = sinon.stub(db.models.ShoppingItem, "create")
    create.rejects(new Error('Some database error.'))
    getRequestHandler('POST /item')(req, res)
  })
  
  it('post request should create an item on valid input', done => {
    const req = { body: { item: 'some item' } }
    const res = {
      sendStatus: status => {
        expect(status).to.equal(200)
        db.models.ShoppingItem.findAll()
          .then(rows => rows.length)
          .then(length => {
            expect(length).to.equal(1)
            done()
          })
      }
    }
    getRequestHandler('POST /item')(req, res)
  })
})
