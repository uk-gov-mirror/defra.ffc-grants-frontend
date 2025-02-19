const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Next Steps page', () => {
  let crumCookie
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/next-steps'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should have Two steps info ', async () => {
    const options = {
      method: 'GET',
      url: '/next-steps',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Submit your details')
    expect(response.payload).toContain('RPA will email you when applications open')
  })

  it('should have warning text ', async () => {
    const options = {
      method: 'GET',
      url: '/next-steps',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('You must not start the project.')
  })

  it('should have continue button to redirect to business details page ', async () => {
    const options = {
      method: 'GET',
      url: '/next-steps',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('/business-detail')
  })

  afterEach(async () => {
    await server.stop()
  })
})
