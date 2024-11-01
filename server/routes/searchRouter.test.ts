import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import SearchService from '../services/searchService'
import { basicGetTest, GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/searchService')
jest.mock('../data/hmppsAuthClient')

let mockAuthClient: jest.Mocked<HmppsAuthClient>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const searchService = new SearchService(mockAuthClient) as jest.Mocked<SearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      searchService,
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
  it('should call the SearchService to return data', () => {
    return request(app)
      .get('/search/results')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(searchService.getOrders).toHaveBeenCalledTimes(1)
      })
  })
})
