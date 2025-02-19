const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Abstraction licence page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
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
      url: '/abstraction-licence'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have an abstraction licence or variation')
  })

  it('should store valid user input and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { abstractionLicence: 'some fake licence', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./SSSI')
  })

  afterEach(async () => {
    await server.stop()
  })
})
