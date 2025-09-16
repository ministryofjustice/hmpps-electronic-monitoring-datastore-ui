import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import IntegrityDetailsService from '../../services/integrity/orderDetailsService'
import IntegrityDetailsController from './detailsController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegritySearchResultsView } from '../../models/view-models/integritySearchResults'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityDetailsService = { getOrderDetails: jest.fn() } as unknown as IntegrityDetailsService

const integrityOrderDetails = [
  {
    legacySubjectId: '1000000',
    firstName: 'Pheobe',
    lastName: 'Smith',
    primaryAddressLine1: 'First line of address',
    primaryAddressLine2: 'Second line of address',
    primaryAddressLine3: 'Third line of address',
    primaryAddressPostCode: 'PostCode',
    alias: null,
    dateOfBirth: '01-01-1970',
    orderStartDate: '08-02-2019',
    orderEndDate: '08-02-2020',
    specials: 'no',
    offenceRisk: false,
  } as IntegrityOrderDetails,
]

const integritySearchResults: IntegritySearchResultsView = [
  {
    legacySubjectId: '1000000',
    firstName: 'Pheobe',
    lastName: 'Smith',
    primaryAddressLine1: 'First line of address',
    primaryAddressLine2: 'Second line of address',
    primaryAddressLine3: 'Third line of address',
    primaryAddressPostCode: 'PostCode',
    alias: null,
    dateOfBirth: '01-01-1970',
    orderStartDate: '08-02-2019',
    orderEndDate: '08-02-2020',
    sortAddress: 'First line of addressSecond line of addressThird line of addressPostCode',
    sortDateOfBirth: 0,
    sortOrderEndDate: 1596326400000,
    sortOrderStartDate: 1564704000000,
  },
]

describe('IntegrityDetailsController', () => {
  let controller: IntegrityDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new IntegrityDetailsController(auditService, integrityDetailsService)
    expect(controller).not.toBeNull()
  })

  describe('Details', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegrityDetailsController(auditService, integrityDetailsService)

      req = createMockRequest({
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      controller.details(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_ORDER_DETAILS_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderServiceParams: GetOrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }
      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      integrityDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.details(req, res, next)

      expect(integrityDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderDetailsService fails`, async () => {
      integrityDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.details(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderDetails = 'expectedOrderDetails'

      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        backUrl: `/integrity/${expectedOrderId}`,
        details: 'expectedOrderDetails',
      }

      integrityDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.details(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/details', expectedPageData)
    })
  })

  describe('SearchResults', () => {
    const queryExecutionId = 'query-execution-id'

    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegrityDetailsController(auditService, integrityDetailsService)

      req = createMockRequest()
      res = createMockResponse()
    })

    it('should redirect to the search page when no orderExecutionId is submitted', async () => {
      integrityDetailsService.getSearchResults = jest.fn().mockResolvedValue(integrityOrderDetails)

      await controller.searchResults(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should render the search results view when a valid orderExecutionId is submitted', async () => {
      const viewModel = [...integritySearchResults]
      req.query.search_id = queryExecutionId

      integrityDetailsService.getSearchResults = jest.fn().mockResolvedValue(integrityOrderDetails)

      await controller.searchResults(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchResults', {
        viewModel,
        orderType: 'integrity',
      })
    })
  })
})
