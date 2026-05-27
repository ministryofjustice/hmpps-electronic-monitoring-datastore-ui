import type { Express } from 'express'
import request from 'supertest'
import paths from '../constants/paths'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import EmDatastoreConnectionService from '../services/emDatastoreConnectionService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import EmDatastoreApiClient from '../data/emDatastoreApiClient'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreOrderSearchService')
jest.mock('../services/emDatastoreConnectionService')

const auditService = new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>
const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(
  {} as EmDatastoreApiClient,
) as jest.Mocked<EmDatastoreOrderSearchService>
const emDatastoreConnectionService = new EmDatastoreConnectionService(null) as jest.Mocked<EmDatastoreConnectionService>

emDatastoreConnectionService.test.mockImplementation().mockResolvedValue({} as JSON)

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreOrderSearchService,
      emDatastoreConnectionService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Core page basic GET requests', () => {
  it.each<GetRequestFixture>([[paths.START, 'Electronic Monitoring Datastore', Page.START_PAGE]])(
    'should render start page',
    (route, titleText, auditType) => basicGetTest(route, titleText, auditType),
  )

  it.each<GetRequestFixture>([[paths.SEARCH, 'Search for order details', Page.SEARCH_PAGE]])(
    'should render search page',
    async (route, titleText, auditType) => basicGetTest(route, titleText, auditType),
  )

  it.each<GetRequestFixture>([[paths.CONNECTION_TEST, 'API test page', Page.TEST_CONNECTION_PAGE]])(
    'should render connection test page',
    async (route, titleText, auditType) => basicGetTest(route, titleText, auditType),
  )
})

export type GetRequestFixture = [route: string, titleText: string, auditType: Page]

export function basicGetTest(route: string, titleText: string, auditType: Page) {
  auditService.logPageView.mockResolvedValue(null)

  return request(app)
    .get(route)
    .expect('Content-Type', /html/)
    .expect(res => {
      expect(res.text).toContain(titleText)

      if (auditType !== null) {
        expect(auditService.logPageView).toHaveBeenCalledWith(auditType, {
          who: user.username,
          correlationId: expect.any(String),
        })
      }
    })
}
