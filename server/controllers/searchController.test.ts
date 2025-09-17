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

  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    searchController = new SearchController(auditService, emDatastoreOrderSearchService)

    emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue({
      queryExecutionId,
    })
  })

  describe('SearchPage', () => {
    it('should render page with no data', async () => {
      const req = createMockRequest({ flash: jest.fn() })
      const res = createMockResponse()

      const expectedViewModel = {
        searchType: {
          value: undefined as string,
        },
        legacySubjectId: {
          value: undefined as string,
        },
        firstName: {
          value: undefined as string,
        },
        lastName: {
          value: undefined as string,
        },
        alias: {
          value: undefined as string,
        },
        dateOfBirth: {
          value: {
            day: undefined as string,
            month: undefined as string,
            year: undefined as string,
          },
        },
        errorSummary: undefined as string,
      }

      await searchController.searchPage(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
    })

    it('should render page with validation errors and form data', async () => {
      const req = createMockRequest({
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { field: 'firstName', error: 'First name must consist of letters only' },
            { field: 'dobDay', error: 'Invalid date format' },
          ])
          .mockReturnValueOnce({
            searchType: 'integrity',
            legacySubjectId: '123456789',
            firstName: 'John123',
            lastName: 'Doe',
            alias: 'JD',
            dobDay: 'xx',
            dobMonth: '13',
            dobYear: '2021',
          }),
      })
      const res = createMockResponse()

      const expectedViewModel = {
        searchType: {
          error: undefined as string,
          value: 'integrity',
        },
        legacySubjectId: {
          error: undefined as string,
          value: '123456789',
        },
        firstName: {
          error: {
            text: 'First name must consist of letters only',
          },
          value: 'John123',
        },
        lastName: {
          error: undefined as string,
          value: 'Doe',
        },
        alias: {
          error: undefined as string,
          value: 'JD',
        },
        dateOfBirth: {
          error: undefined as string,
          value: {
            day: 'xx',
            month: '13',
            year: '2021',
          },
        },
        errorSummary: {
          errorList: [
            {
              error: 'First name must consist of letters only',
              field: 'firstName',
            },
            {
              error: 'Invalid date format',
              field: 'dobDay',
            },
          ],
          title: 'There is a problem',
        },
      }

      await searchController.searchPage(req, res, jest.fn())
      expect(res.render).toHaveBeenCalledWith('pages/search', expectedViewModel)
    })
  })

  describe('SubmitSearchQuery', () => {
    it('should redirect to search with appropriate error when validation errors exist', async () => {
      const req = createMockRequest({
        flash: jest.fn(),
        body: {
          searchType: 'integrity',
          firstName: 'John@123.com',
          lastName: 'Doe',
          alias: 'JD',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
        },
      })
      const res = createMockResponse()

      await searchController.submitSearchQuery(req, res, next)

      expect(OrderSearchCriteria.safeParse).toHaveBeenCalledWith(req.body)
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', req.body)
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        { field: 'firstName', error: 'First name must contain letters only' },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should redirect to search with appropriate error when no search data supplied', async () => {
      const req = createMockRequest({
        flash: jest.fn(),
        body: {
          searchType: 'integrity',
          firstName: '',
          lastName: '',
          alias: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
        },
      })
      const res = createMockResponse()

      await searchController.submitSearchQuery(req, res, next)

      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', req.body)
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        {
          error: 'You must enter a value into at least one search field',
          field: '',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('when input is valid, redirects to the integrity results page with the query execution ID as a URL query parameter', async () => {
      emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue({
        queryExecutionId,
      })

      const req = createMockRequest({
        flash: jest.fn(),
        body: {
          searchType: 'integrity',
          firstName: 'John',
          lastName: '',
          alias: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
        },
      })
      const res = createMockResponse()

      await searchController.submitSearchQuery(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/integrity?search_id=${queryExecutionId}`)
    })

    it('when input is valid, redirects to the alcohol monitoring results page with the query execution ID as a URL query parameter', async () => {
      emDatastoreOrderSearchService.submitSearchQuery = jest.fn().mockResolvedValue({
        queryExecutionId,
      })

      const req = createMockRequest({
        flash: jest.fn(),
        body: {
          searchType: 'alcohol-monitoring',
          firstName: 'John',
          lastName: '',
          alias: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
        },
      })
      const res = createMockResponse()

      await searchController.submitSearchQuery(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/alcohol-monitoring?search_id=${queryExecutionId}`)
    })
  })
})
