import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import { GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreOrderSearchService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new EmDatastoreOrderSearchService(
  null,
  null,
) as jest.Mocked<EmDatastoreOrderSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreOrderSearchService: datastoreSearchService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Core page basic GET requests', () => {
  it.each<GetRequestFixture>([['search page', '/search', 'Search for order details', Page.SEARCH_PAGE]])(
    'should render %s',
    async (pageName, route, titleText, auditType) => {
      const res = await request(app).get(route).expect(200) // Expect a 200 OK response

      expect(res.text).toContain(titleText)
      expect(auditService.logPageView).toHaveBeenCalledWith(auditType, {
        who: user.username,
        correlationId: expect.any(String),
      })
    },
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
