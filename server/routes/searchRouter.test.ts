import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import DatastoreSearchService from '../services/datastoreSearchService'
import { basicGetTest, GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/datastoreSearchService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new DatastoreSearchService(null, null) as jest.Mocked<DatastoreSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      datastoreSearchService,
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
  it('should call the DatastoreSearchService to return data', () => {
    return request(app)
      .get('/search/results')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(datastoreSearchService.searchForOrders).toHaveBeenCalledTimes(1)
      })
  })
})
