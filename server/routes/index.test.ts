import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import SearchService from '../services/searchService'
import OrderService from '../services/orderService'

jest.mock('../services/auditService')
jest.mock('../services/searchService')
jest.mock('../services/orderService')
jest.mock('../data/hmppsAuthClient')

let mockAuthClient: jest.Mocked<HmppsAuthClient>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const searchService = new SearchService(mockAuthClient) as jest.Mocked<SearchService>
const orderService = new OrderService() as jest.Mocked<OrderService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      searchService,
      orderService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Core page basic GET requests', () => {
  it.each<GetRequestFixture>([['index page', '/', 'Electronic Monitoring Datastore', Page.START_PAGE]])(
    'should render %s',
    (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType),
  )
})

export type GetRequestFixture = [pageName: string, route: string, titleText: string, auditType: Page]

export function basicGetTest(pageName: string, route: string, titleText: string, auditType: Page) {
  auditService.logPageView.mockResolvedValue(null)

  return request(app)
    .get(route)
    .expect('Content-Type', /html/)
    .expect(res => {
      expect(res.text).toContain(titleText)
      expect(auditService.logPageView).toHaveBeenCalledWith(auditType, {
        who: user.username,
        correlationId: expect.any(String),
      })
    })
}
