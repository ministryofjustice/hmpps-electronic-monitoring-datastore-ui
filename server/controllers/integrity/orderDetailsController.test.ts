import { Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import IntegrityOrderDetailsService from '../../services/integrity/orderDetailsService'
import IntegrityOrderDetailsController from './orderDetailsController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegritySearchResultView } from '../../models/view-models/integritySearchResults'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import { IntegrityOrderDetailsView } from '../../models/view-models/integrityOrderDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityOrderDetailsService = {
  getOrderDetails: jest.fn(),
} as unknown as IntegrityOrderDetailsService

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

const integritySearchResults: IntegritySearchResultView = [
  {
    legacySubjectId: '1000000',
    name: 'Pheobe Smith',
    primaryAddress: ['First line of address', 'Second line of address', 'Third line of address', 'PostCode'],
    alias: null,
    dateOfBirth: '01-01-1970',
    orderStartDate: '08-02-2019',
    orderEndDate: '08-02-2020',
    sortAddress: 'First line of address Second line of address Third line of address PostCode',
    sortDateOfBirth: 0,
    sortOrderEndDate: 1596326400000,
    sortOrderStartDate: 1564704000000,
  },
]

describe('Integrity summary Controller', () => {
  let controller: IntegrityOrderDetailsController

  const expectedOrderId = 'testId'
  const req = createMockRequest({
    params: {
      legacySubjectId: expectedOrderId,
    },
    id: 'fakeId', // correlation-id
  })
  let res: Response
  const next = jest.fn()

  describe('Integrity order details', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegrityOrderDetailsController(auditService, integrityOrderDetailsService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      controller.details(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_ORDER_DETAILS_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderServiceParams: GetOrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
        restricted: false,
      }

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.details(req, res, next)

      expect(integrityOrderDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderDetailsService fails`, async () => {
      integrityOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.details(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = {
        firstName: 'John',
        lastName: 'West',
      }

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        deviceWearerDetails: {
          adultOrChild: undefined,
          alias: undefined,
          contact: undefined,
          dateOfBirth: undefined,
          falseLimbRisk: undefined,
          firstName: 'John',
          lastName: 'West',
          legacySubjectId: 'testId',
          manualRisk: undefined,
          mappa: undefined,
          migratedRisk: undefined,
          offenseRisk: 'No',
          phoneOrMobileNumber: undefined,
          postCodeRisk: undefined,
          ppo: undefined,
          primaryAddress: [],
          rangeRisk: undefined,
          reportRisk: undefined,
          sex: undefined,
          specials: undefined,
          technicalBail: undefined,
        },
        orderDetails: {
          notifyingOrganisationDetailsName: undefined,
          orderEndDate: undefined,
          orderStartDate: undefined,
          orderType: undefined,
          orderTypeDescription: undefined,
          orderTypeDetail: undefined,
          responsibleOrganisation: undefined,
          responsibleOrganisationDetailsRegion: undefined,
          wearingWristPid: undefined,
        },
        backUrl: `/integrity/${expectedOrderId}`,
      } as IntegrityOrderDetailsView

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.details(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/details', expectedPageData)
    })
  })

  describe('SearchResults', () => {
    const queryExecutionId = 'query-execution-id'

    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegrityOrderDetailsController(auditService, integrityOrderDetailsService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it('should redirect to the search page when no orderExecutionId is submitted', async () => {
      integrityOrderDetailsService.getSearchResults = jest.fn().mockResolvedValue(integrityOrderDetails)

      await controller.searchResults(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith('/search')
    })

    it('should render the search results view when a valid orderExecutionId is submitted', async () => {
      const viewModel = [...integritySearchResults]
      req.query.search_id = queryExecutionId

      integrityOrderDetailsService.getSearchResults = jest.fn().mockResolvedValue(integrityOrderDetails)

      await controller.searchResults(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchResults', {
        viewModel,
        orderType: 'integrity',
      })
    })
  })
})
