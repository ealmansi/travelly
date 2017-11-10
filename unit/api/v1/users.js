const HttpStatus = require('http-status-codes')
const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const assert = chai.assert
const expect = chai.expect
chai.should()
chai.use(chaiAsPromised)

const testUser = {
  username: 'someUser',
  email: 'someUser@domain.com',
  password: 'somePassword'
}

describe('v1 users routes unit tests', function() {
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

  it('admin user should exist by default', async () => {
    const req = { body: { } }
    const res = getMockResponseObject()
    await getHandler('GET /users')(req, res)
    assert.deepEqual(res.response.length, 1)
    assert.deepEqual(res.response[0].role, 'admin')
  })

  it('get :userId should return user from params', async () => {
    const req = { params: { user: testUser } }
    const res = getMockResponseObject()
    await getHandler('GET /users/:userId')(req, res)
    assert.equal(res.response.username, testUser.username)
  })

  it('post should create a new user', async () => {
    const req = { user: { role: 'admin' }, body: testUser }
    const res = getMockResponseObject()
    await getHandler('POST /users')(req, res)
    assert.equal(res.response.username, testUser.username)
  })
})
