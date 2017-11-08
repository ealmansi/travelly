const util = require('../../util')
const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const assert = chai.assert
const expect = chai.expect
chai.should()
chai.use(chaiAsPromised)

const testUser = {
  name: 'test_name',
  username: 'test_username',
  email: 'test_email@domain.com',
  password: 'test_password'
}

describe('auth signup unit tests', function() {
  let db
  let getRequestHandler
  
  beforeEach(function(done) {
    db = require('../../db')
    db.sequelize.sync().then(() => {
      const api = require('../../../src/api/auth')(db)
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

  it('signup request should fail on invalid input', done => {
    const req = { body: { } }
    const res = {
      sendStatus: status => {
        expect(status).to.equal(422)
        done()
      }
    }
    getRequestHandler('POST /signup')(req, res)
  })
  
  it('signup request should succed on valid input', done => {
    const req = { body: testUser }
    const res = {
      send: user => {
        expect(user.username).to.equal(testUser.username)
        db.models.User.find({ where: { username: testUser.username } })
          .then(user => {
            expect(user).to.not.be.undefined
            done()
          })
      }
    }
    getRequestHandler('POST /signup')(req, res)
  })
})
