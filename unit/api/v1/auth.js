const HttpStatus = require('http-status-codes')
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

describe('auth routes unit tests', function() {
  let db
  let getHandler
  let getMockResponseObject
  
  beforeEach(async () => {
    db = require('../../db')
    await db.initialize()
    const api = require('../../../src/api/v1')(db)
    const util = require('../../util')(api)
    getHandler = util.getHandler
    getMockResponseObject = util.getMockResponseObject
  })

  afterEach(async () => {
    await db.sequelize.drop()
    delete require.cache[require.resolve('../../db')]
  })

  it('signup request should fail on invalid input', async () => {
    const req = { body: { } }
    const res = {
      sendStatus: status => {
        expect(status).to.equal(HttpStatus.BAD_REQUEST)
      }
    }
    await getHandler('POST /auth/signup')(req, res)
  })
  
  it('signup request should succed on valid input', async () => {
    const req = { body: testUser }
    const res = {
      send: user => {
        expect(user.username).to.equal(testUser.username)
        db.models.User.find({ where: { username: testUser.username } })
          .then(user => {
            expect(user).to.not.be.undefined
          })
      }
    }
    await getHandler('POST /auth/signup')(req, res)
  })
})
