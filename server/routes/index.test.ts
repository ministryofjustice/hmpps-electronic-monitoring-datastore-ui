import type { Express } from 'express'
import request from 'supertest'
import paths from '../constants/paths'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreOrderSearchService, EmDatastoreConnectionService } from '../services'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreOrderSearchService')
jest.mock('../services/emDatastoreConnectionService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(
  null,
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

  it.each<GetRequestFixture>([[paths.CONNECTION_TEST, 'API test page', null]])(
    'should render connection test page',
    async (route, titleText, auditType) => basicGetTest(route, titleText, auditType),
  )
})

describe('Search results page', () => {
  // TODO: Fix this test by mocking return values of the datastoreSearchService .validateInput() and .search() methods
  // it('Returns data', async () => {
  //   const req = createMockRequest({
  //     session: {
  //       id: 'mock-session-id',
  //       cookie: { originalMaxAge: 3600000 } as session.Cookie,
  //       regenerate: jest.fn(),
  //       destroy: jest.fn(),
  //       reload: jest.fn(),
  //       save: jest.fn(),
  //       touch: jest.fn(),
  //       resetMaxAge: jest.fn(),
  //       returnTo: '/return',
  //       nowInMinutes: 12345,
  //       validationErrors: [],
  //       formData: {},
  //     } as session.Session & Partial<SessionData>,
  //   })
  //   const res = await request(app)
  //   .post('/search')
  //   .expect(200) // Expect a 200 OK response
  //       expect(res.text).toContain('Search results')
  //       expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_RESULTS_PAGE, {
  //         who: user.username,
  //         correlationId: expect.any(String),
  //       })
  // })
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
