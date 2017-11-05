const logger = require('../../src/logger')
const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const assert = chai.assert
const expect = chai.expect
chai.should()
chai.use(chaiAsPromised)

describe('item route unit tests', function() {
  let db
  let handlers
  
  beforeEach(function(done) {
    db = require('../db')
    db.sequelize.sync().then(() => {
      handlers = require('../../src/routes/item')(db)
      done()
    })
  })

  afterEach(function(done) {
    db.sequelize.drop().then(() => {
      delete require.cache[require.resolve('../db')]
      done()
    })
  })

  it('post request should fail on invalid input', () => {
    const req = { body: { } }
    const res = { sendStatus: sinon.spy() }
    return handlers.post(req, res)
      .then(() => expect(res.sendStatus.calledWith(422)).to.be.true)
  })

  it('post request should fail on database failure', () => {
    const req = { body: { item: 'some item' } }
    const res = { sendStatus: sinon.spy() }
    const create = sinon.stub(db.models.ShoppingItem, "create")
    create.rejects(new Error('Some database error.'))
    return handlers.post(req, res)
      .then(() => {
        expect(res.sendStatus.calledWith(500)).to.be.true
      })
  })
  
  it('post request should create an item on valid input', () => {
    const req = { body: { item: 'some item' } }
    const res = { sendStatus: sinon.spy() }
    return handlers.post(req, res)
      .then(() => {
        expect(res.sendStatus.calledWith(200)).to.be.true
        return db.models.ShoppingItem.findAll()
      })
      .then(rows => rows.length)
      .should.eventually.equal(1)
  })
})
