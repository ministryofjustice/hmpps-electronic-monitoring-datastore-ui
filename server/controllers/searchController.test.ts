import { Request, Response } from 'express'
import AuditService from '../services/auditService'
import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import SearchController from './searchController'
import { OrderSearchView } from '../models/view-models/orderSearch'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { OrderSearchCriteria } from '../models/requests/SearchOrdersRequest'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreOrderSearchService')

const queryExecutionId = 'query-execution-id'

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreOrderSearchService = { submitSearchQuery: jest.fn() } as unknown as EmDatastoreOrderSearchService

jest.spyOn(OrderSearchView, 'construct')
jest.spyOn(OrderSearchCriteria, 'safeParse')

describe('SearchController', () => {
  let searchController: SearchController

  let req: Request
  let res: Response

  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    searchController = new SearchController(auditService, emDatastoreOrderSearchService)

    req = createMockRequest()
    res = createMockResponse()

    emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue({
      queryExecutionId,
    })
  })

  describe('SearchPage', () => {
    it('should render page with no data', async () => {
      const expectedViewModel = {
        validationErrors: [],
      } as OrderSearchView

      await searchController.searchPage(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
    })

    it('should render page with validation errors and form data', async () => {
      req.session.formData = {
        searchType: 'integrity',
        firstName: 'John123',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: 'xx',
        dobMonth: '13',
        dobYear: '2021',
      }

      req.session.validationErrors = [
        { field: 'firstName', message: 'First name must consist of letters only' },
        { field: 'dobDay', message: 'Invalid date format' },
      ]

      const expectedViewModel = {
        searchType: 'integrity',
        firstName: 'John123',
        // error: 'First name must consist of letters only',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: 'xx',
        dobMonth: '13',
        dobYear: '2021',
        // error: 'Invalid date format',
        validationErrors: [
          { field: 'firstName', message: 'First name must consist of letters only' },
          { field: 'dobDay', message: 'Invalid date format' },
        ],
      }

      await searchController.searchPage(req, res, jest.fn())
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
    })
  })

  describe('SubmitSearchQuery', () => {
    it('should redirect to search with appropriate error when validation errors exist', async () => {
      req.body = {
        firstName: 'John@123.com',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      await searchController.submitSearchQuery(req, res, next)

      expect(OrderSearchCriteria.safeParse).toHaveBeenCalledWith(req.body)
      expect(req.session.formData).toEqual(req.body)
      expect(req.session.validationErrors).toHaveLength(1)
      expect(req.session.validationErrors[0]).toHaveProperty('field', 'firstName')
      expect(req.session.validationErrors[0]).toHaveProperty('message', 'First name must contain letters only')
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should redirect to search with appropriate error when no search data supplied', async () => {
      req.body = {
        searchType: 'integrity',
        firstName: '',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }

      await searchController.submitSearchQuery(req, res, next)

      expect(req.session.formData).toEqual(req.body)
      expect(req.session.validationErrors).toHaveLength(1)
      expect(req.session.validationErrors[0]).toHaveProperty('field', '')
      expect(req.session.validationErrors[0]).toHaveProperty(
        'message',
        'You must enter a value into at least one search field',
      )
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('when input is valid, redirects to the results page with the query execution ID as a URL query parameter', async () => {
      emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue({
        queryExecutionId,
      })

      req.body = {
        searchType: 'integrity',
        firstName: 'John',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }

      await searchController.submitSearchQuery(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/integrity?search_id=${queryExecutionId}`)
    })
  })
})
