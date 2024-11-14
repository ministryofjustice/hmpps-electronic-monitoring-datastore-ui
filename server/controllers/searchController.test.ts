import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreSearchService } from '../services'
import SearchController from './searchController'

// import { Page } from '../services/auditService'
// import { Order } from '../interfaces/order'
import orders from '../data/mockData/orders'

import tabulateOrders from '../utils/tabulateOrders'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

jest.mock('../services/auditService')
jest.mock('../services/datastoreSearchService')

jest.mock('../utils/tabulateOrders', () => jest.fn(() => []))

// const token = 'fake-token-value'
const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

datastoreSearchService.searchForOrders = jest.fn().mockResolvedValue(orders)

describe('SearchController', () => {
  let searchController: SearchController
  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    searchController = new SearchController(auditService, datastoreSearchService)

    req = createMockRequest()
    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    await searchController.search(req as Request, res as Response, next)
    // TODO: Add page headings to constants
    // expect(res.locals.page).toEqual({ id: strings.pageHeadings.searchOrderForm })
    expect(res.locals.errors).toBeDefined()
    expect(res.locals.formData).toBeDefined()
    expect(res.render).toHaveBeenCalledWith('pages/search')
  })

  it('should render page with existing data', async () => {
    res.locals.validationErrors = []
    res.locals.formData = []
    await searchController.search(req as Request, res as Response, next)
    // may be do not worry about res.locals for now?
    // TODO: Add page headings to constants
    // expect(res.locals.page).toEqual({ id: strings.pageHeadings.searchOrderForm })
    // locals should contain form data (unsaved values) and errors
    expect(res.locals.validationErrors).toBeDefined()
    expect(res.locals.formData).toBeDefined()

    /**
     * Want to be able to validate unsavedData
     * How am I going to handle this? req.flash or req.session ??
     *  unsaved values should be persistend
     *  validation failures should be persitted.
     */

    expect(res.render).toHaveBeenCalledWith('pages/search')
  })

  it('should fetch orders, tabulate them, and render the results page', async () => {
    await searchController.view(req as Request, res as Response, next)

    expect(datastoreSearchService.searchForOrders).toHaveBeenCalled()
    expect(tabulateOrders).toHaveBeenCalledWith(expect.any(Array))
    expect(res.render).toHaveBeenCalledWith('pages/searchResults', { data: expect.any(Array) })
  })
})
