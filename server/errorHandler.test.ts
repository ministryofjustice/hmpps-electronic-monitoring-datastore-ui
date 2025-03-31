import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
      })
  })
})

describe('GET 500', () => {
  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/integrity/orders/---/details')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('Sorry, there is a problem with the service')
        expect(res.text).toContain('Error fetching data')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/integrity/orders/---/curfew-timetable')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, there is a problem with the service')
        expect(res.text).not.toContain('Error fetching data')
      })
  })
})
