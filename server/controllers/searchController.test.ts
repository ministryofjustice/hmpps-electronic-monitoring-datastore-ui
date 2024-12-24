import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreSearchService } from '../services'
import SearchController from './searchController'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import orders from '../data/mockData/orders'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import SearchOrderFormDataModel from '../models/form-data/searchOrder'

jest.mock('../services/auditService')
jest.mock('../services/datastoreSearchService')

jest.mock('../utils/tabulateOrders', () => jest.fn(() => []))
jest.mock('../models/form-data/searchOrder')

const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

datastoreSearchService.searchForOrders = jest.fn().mockResolvedValue(orders)

jest.mock('../models/view-models/searchForOrders')
describe('SearchController', () => {
  let searchController: SearchController
  let req: Request
  let res: Response
  let next = jest.fn()

  describe('SearchController - search', () => {
    beforeEach(() => {
      searchController = new SearchController(auditService, datastoreSearchService)

      req = createMockRequest({
        session: {
          id: 'mock-session-id',
          cookie: { originalMaxAge: 3600000 } as session.Cookie,
          regenerate: jest.fn(),
          destroy: jest.fn(),
          reload: jest.fn(),
          save: jest.fn(),
          touch: jest.fn(),
          resetMaxAge: jest.fn(),
          returnTo: '/return',
          nowInMinutes: 12345,
          validationErrors: [],
          formData: {},
        } as session.Session & Partial<SessionData>,
      })

      res = createMockResponse()
    })

    it('should render page with no data', async () => {
      ;(SearchForOrdersViewModel.construct as jest.Mock).mockReturnValue({
        formData: {}, // No form data
        validationErrors: [], // No validation errors
      })

      await searchController.search(req, res, next)

      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith({}, [])
      expect(res.render).toHaveBeenCalledWith('pages/search', {
        formData: {},
        validationErrors: [],
      })
    })

    it('should render page with validation errors and form data', async () => {
      req.session.validationErrors = [
        { field: 'firstName', error: 'First name must consist of letters only' },
        { field: 'dob', error: 'Invalid date format' },
      ]
      req.session.formData = {
        firstName: 'John123',
        lastName: 'Doe',
        alias: 'JD',
        'dob-day': '32',
        'dob-month': '13',
        'dob-year': '2021',
      }
      ;(SearchForOrdersViewModel.construct as jest.Mock).mockReturnValue({
        formData: { firstName: 'John123', lastName: 'Doe', alias: 'JD', dob: { day: '32', month: '13', year: '2021' } },
        validationErrors: [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      })

      await searchController.search(req, res, jest.fn())

      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith(
        {
          firstName: 'John123',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '32',
          'dob-month': '13',
          'dob-year': '2021',
        },
        [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      )
      expect(res.render).toHaveBeenCalledWith('pages/search', {
        formData: { firstName: 'John123', lastName: 'Doe', alias: 'JD', dob: { day: '32', month: '13', year: '2021' } },
        validationErrors: [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      })
    })
  })

  describe('SearchController - view', () => {
    beforeEach(() => {
      searchController = new SearchController(auditService, datastoreSearchService)

      req = createMockRequest({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
        session: {
          id: 'mock-session-id',
          cookie: { originalMaxAge: 3600000 } as session.Cookie,
          regenerate: jest.fn(),
          destroy: jest.fn(),
          reload: jest.fn(),
          save: jest.fn(),
          touch: jest.fn(),
          resetMaxAge: jest.fn(),
          returnTo: '/return',
          nowInMinutes: 12345,
          validationErrors: [],
          formData: {},
        } as session.Session & Partial<SessionData>,
      })
      res = createMockResponse()
      next = jest.fn()

      jest.clearAllMocks() // Clear previous mocks to avoid interference
    })

    it('should redirect to search when validation errors exist', async () => {
      ;(SearchOrderFormDataModel.parse as jest.Mock).mockReturnValue(req.body)

      datastoreSearchService.search = jest.fn().mockResolvedValue([{ field: 'firstName', error: 'Invalid first name' }])

      await searchController.view(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(req.body)
      expect(req.session.validationErrors).toEqual([{ field: 'firstName', error: 'Invalid first name' }])
      expect(res.redirect).toHaveBeenCalledWith('search')
    })

    it('should render search results view when valid orders are returned', async () => {
      ;(SearchOrderFormDataModel.parse as jest.Mock).mockReturnValue({
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        'dob-day': '10',
        'dob-month': '02',
        'dob-year': '2021',
      })

      datastoreSearchService.search = jest.fn().mockResolvedValue(orders)

      await searchController.view(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(res.render).toHaveBeenCalledWith('pages/searchResults', {
        data: [], // Based on mocked `tabulateOrders`
      })
    })

    it('should render no search results view when no orders are returned', async () => {
      ;(SearchOrderFormDataModel.parse as jest.Mock).mockReturnValue({
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        'dob-day': '10',
        'dob-month': '02',
        'dob-year': '2021',
      })

      datastoreSearchService.search = jest.fn().mockResolvedValue([])

      await searchController.view(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(res.render).toHaveBeenCalledWith('pages/noResults')
    })
  })
})
