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
jest.mock('../utils/tabulateOrders', () => jest.fn((): unknown[] => ['mockOrders']))

const queryExecutionId = 'query-execution-id'
const queryExecutionResponse = {
  queryExecutionId,
}

const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = {
  logPageView: jest.fn(),
} as unknown as AuditService

const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

jest.spyOn(SearchForOrdersViewModel, 'construct')
jest.spyOn(SearchOrderFormDataModel, 'parse')

describe('SearchController', () => {
  let searchController: SearchController
  let req: Request
  let res: Response
  let next = jest.fn()

  describe('SearchPage', () => {
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
      const expectedViewModel = {
        dob: {
          value: {
            day: '',
            month: '',
            year: '',
          },
        },
      }

      await searchController.searchPage(req, res, next)

      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith({}, [])
      expect(SearchForOrdersViewModel.construct).toHaveReturnedWith(expectedViewModel)
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
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

      const expectedViewModel = {
        firstName: {
          value: 'John123',
          error: {
            text: 'First name must consist of letters only',
          },
        },
        lastName: {
          value: 'Doe',
        },
        alias: {
          value: 'JD',
        },
        dob: {
          value: {
            day: '32',
            month: '13',
            year: '2021',
          },
          error: {
            text: 'Invalid date format',
          },
        },
      }

      await searchController.searchPage(req, res, jest.fn())

      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith(
        req.session.formData,
        req.session.validationErrors,
      )
      expect(SearchForOrdersViewModel.construct).toHaveReturnedWith(expectedViewModel)
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
    })
  })

  describe('SubmitSearchQuery', () => {
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

      jest.clearAllMocks()
    })

    it('should redirect to search with appropriate error when validation errors exist', async () => {
      datastoreSearchService.validateInput = jest
        .fn()
        .mockReturnValueOnce([{ field: 'firstName', error: 'Invalid first name' }])

      await searchController.submitSearchQuery(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(req.body)
      expect(req.session.validationErrors).toEqual([{ field: 'firstName', error: 'Invalid first name' }])
      expect(res.redirect).toHaveBeenCalledWith('search')
    })

    it('should redirect to search with appropriate error when no search data supplied', async () => {
      const validationErrors = [
        {
          field: 'form',
          error: 'You must enter a value into at least one search field',
        },
      ]

      req.body = {
        firstName: '',
        lastName: '',
        alias: '',
        'dob-day': '',
        'dob-month': '',
        'dob-year': '',
      }

      datastoreSearchService.validateInput = jest.fn().mockReturnValueOnce(validationErrors)

      await searchController.submitSearchQuery(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(req.body)
      expect(req.session.validationErrors).toEqual(validationErrors)
      expect(res.redirect).toHaveBeenCalledWith('search')
    })

    it('when input is valid, redirects to the results page with the query execution ID as a URL query parameter', async () => {
      datastoreSearchService.validateInput = jest.fn().mockReturnValueOnce([])
      datastoreSearchService.submitSearchQuery = jest.fn().mockResolvedValue(queryExecutionResponse)

      await searchController.submitSearchQuery(req, res, next)

      expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(res.redirect).toHaveBeenCalledWith(`search/orders?search_id=${queryExecutionId}`)
    })
  })

  describe('SearchResultsPage', () => {
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
      next = jest.fn()

      jest.clearAllMocks()
    })

    it('should redirect to the search page when no orderExecutionId is submitted', async () => {
      datastoreSearchService.getSearchResults = jest.fn().mockResolvedValue(orders)

      await searchController.searchResultsPage(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should render the search results view when a valid orderExecutionId is submitted', async () => {
      req.query.search_id = queryExecutionId
      datastoreSearchService.getSearchResults = jest.fn().mockResolvedValue(orders)

      const mockOrders = ['mockOrders'] as string[]

      await searchController.searchResultsPage(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchResults', {
        data: mockOrders,
      })
    })
  })
})
