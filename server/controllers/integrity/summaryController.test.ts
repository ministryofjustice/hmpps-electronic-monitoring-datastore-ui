import { Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityOrderDetailsService } from '../../services'
import IntegritySummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityOrderSummaryView } from '../../models/view-models/integrityOrderSummary'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityOrderDetailsService = {
  getOrderDetails: jest.fn(),
} as unknown as IntegrityOrderDetailsService

describe('Integrity summary Controller', () => {
  let controller: IntegritySummaryController

  const expectedOrderId = 'testId'
  const req = createMockRequest({
    params: {
      legacySubjectId: expectedOrderId,
    },
    id: 'fakeId', // correlation-id
  })
  let res: Response
  const next = jest.fn()

  describe('Integrity order summary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegritySummaryController(auditService, integrityOrderDetailsService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.summary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_ORDER_SUMMARY_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderServiceParams: GetOrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.summary(req, res, next)

      expect(integrityOrderDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      integrityOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.summary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = {
        firstName: 'John',
        lastName: 'West',
      }

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        orderSummary: {
          alias: undefined,
          dateOfBirth: undefined,
          legacySubjectId: 'testId',
          name: 'John West',
          orderEndDate: undefined,
          orderStartDate: undefined,
          primaryAddress: [],
        },
        backUrl: '/integrity',
      } as IntegrityOrderSummaryView

      integrityOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/summary', expectedPageData)
    })
  })
})
