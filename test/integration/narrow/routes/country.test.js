describe('Country Page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load country page sucessfully', async () => {
    const options = {
      method: 'GET',
      url: '/country'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
        method: 'POST',
        url: '/country',
        payload: { inEngland: null }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You must select an option')
  })
  
  it('should returns error message if postcode is not entered for selected yes option ', async () => {
    const postOptions = {
        method: 'POST',
        url: '/country',
        payload: { inEngland: 'Yes' , project_postcode: ''}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('If yes, please type in postcode')
})

it('should store user response and redirects to project details page', async () => {
  const postOptions = {
      method: 'POST',
      url: '/country',
      payload: { inEngland: 'Yes' , project_postcode: 'XX1 5XX' }
  }

  const postResponse = await server.inject(postOptions)
  expect(postResponse.statusCode).toBe(302)
  expect(postResponse.headers.location).toBe('./project-details')
})
  
it(`should display ineligible page when user response is 'No'`, async () => {
  const postOptions = {
      method: 'POST',
      url: '/country',
      payload: { inEngland: 'No' }
  }

  const postResponse = await server.inject(postOptions)
  expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
  )
})
  
  afterEach(async () => {
    await server.stop()
  })
})
