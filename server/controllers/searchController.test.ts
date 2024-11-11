import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreSearchService } from '../services'
import SearchController from './searchController'
import { Page } from '../services/auditService'
import { Order } from '../interfaces/order'
import orders from '../data/mockData/orders'

import tabluateOrders from '../utils/tabulateOrders'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

jest.mock('../services/auditService')
jest.mock('../services/datastoreSearchService')

jest.mock('../utils/tabulateOrders', () => jest.fn(() => []))

const token = 'fake-token-value'
const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockReturnValue(datastoreClient)
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

datastoreSearchService.searchForOrders = jest.fn().mockReturnValue([])

afterEach(() => {
  jest.resetAllMocks()
})

describe('SearchController', () => {
  let searchController: SearchController
  let req: Partial<Request>
  let res: Partial<Response>
  const next = jest.fn()

  beforeEach(() => {
    searchController = new SearchController(auditService, datastoreSearchService)

    req = createMockRequest()
    res = createMockResponse()
  })

  it('should fetch orders, tabulate them, and render the results page', async () => {
    await searchController.view(req as Request, res as Response, next)

    expect(datastoreSearchService.searchForOrders).toHaveBeenCalled()
    expect(tabluateOrders).toHaveBeenCalledWith(expect.any(Array))
    expect(res.render).toHaveBeenCalledWith('pages/searchResults', { data: expect.any(Array) })
  })
})
