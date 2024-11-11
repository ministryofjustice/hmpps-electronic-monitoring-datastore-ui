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
  it.each<GetRequestFixture>([['search page', '/search', 'Search for case details', Page.SEARCH_PAGE]])(
    'should render %s',
    (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType),
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
