import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../services/auditService'
import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import SearchController from './searchController'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import orders from '../data/mockData/orders'
import ordersView from '../data/mockData/ordersView'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { ParsedSearchFormData, ParsedSearchFormDataModel } from '../models/form-data/searchOrder'
import { ErrorMessage, TextField } from '../models/utils'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreOrderSearchService')

const queryExecutionId = 'query-execution-id'
const queryExecutionResponse = {
  queryExecutionId,
}

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreOrderSearchService = {
  isEmptySearch: jest.fn(),
  validateInput: jest.fn(),
  submitSearchQuery: jest.fn(),
  getSearchResults: jest.fn(),
} as unknown as EmDatastoreOrderSearchService

jest.spyOn(SearchForOrdersViewModel, 'construct')
jest.spyOn(ParsedSearchFormDataModel, 'parse')

describe('SearchController', () => {
  let searchController: SearchController
  let req: Request
  let res: Response
  let next = jest.fn()

  describe('SearchPage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      searchController = new SearchController(auditService, emDatastoreOrderSearchService)

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
        searchType: 'integrity',
        firstName: 'John123',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: '32',
        dobMonth: '13',
        dobYear: '2021',
      }

      const expectedViewModel = {
        searchType: {
          value: 'integrity',
        },
        legacySubjectId: undefined as TextField | undefined,
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
        emptyFormError: undefined as ErrorMessage | undefined,
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
      searchController = new SearchController(auditService, emDatastoreOrderSearchService)

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
      const parsedFormData: ParsedSearchFormData = {
        searchType: undefined,
        legacySubjectId: undefined,
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      emDatastoreOrderSearchService.validateInput = jest
        .fn()
        .mockReturnValueOnce([{ field: 'firstName', error: 'Invalid first name' }])

      await searchController.submitSearchQuery(req, res, next)

      expect(ParsedSearchFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(parsedFormData)
      expect(req.session.validationErrors).toEqual([{ field: 'firstName', error: 'Invalid first name' }])
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should redirect to search with appropriate error when no search data supplied', async () => {
      const validationErrors = [
        {
          field: 'form',
          error: 'You must enter a value into at least one search field',
        },
      ]

      req.body = {
        searchType: 'integrity',
        firstName: '',
        lastName: '',
        alias: '',
        'dob-day': '',
        'dob-month': '',
        'dob-year': '',
      }

      const parsedFormData = {
        searchType: 'integrity',
        firstName: '',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }

      emDatastoreOrderSearchService.validateInput = jest.fn().mockReturnValueOnce(validationErrors)

      await searchController.submitSearchQuery(req, res, next)

      expect(ParsedSearchFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(parsedFormData)
      expect(req.session.validationErrors).toEqual(validationErrors)
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('when input is valid, redirects to the results page with the query execution ID as a URL query parameter', async () => {
      emDatastoreOrderSearchService.validateInput = jest.fn().mockReturnValueOnce([])
      emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue(queryExecutionResponse)

      req.body = {
        searchType: 'integrity',
        firstName: '',
        lastName: '',
        alias: '',
        'dob-day': '',
        'dob-month': '',
        'dob-year': '',
      }

      await searchController.submitSearchQuery(req, res, next)

      expect(ParsedSearchFormDataModel.parse).toHaveBeenCalledWith(req.body)
      expect(res.redirect).toHaveBeenCalledWith(`/integrity?search_id=${queryExecutionId}`)
    })
  })

  describe('SearchResultsPage', () => {
    beforeEach(() => {
      searchController = new SearchController(auditService, emDatastoreOrderSearchService)

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
      emDatastoreOrderSearchService.getSearchResults = jest.fn().mockResolvedValue(orders)

      await searchController.searchResultsPage(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should render the search results view when a valid orderExecutionId is submitted', async () => {
      const viewModel = [...ordersView]
      req.query.search_id = queryExecutionId
      emDatastoreOrderSearchService.getSearchResults = jest.fn().mockResolvedValue(orders)

      await searchController.searchResultsPage(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchResults', {
        viewModel,
      })
    })
  })
})
