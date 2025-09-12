import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import { IntegrityDetailsService } from '../../services'
import IntegritySummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../types/OrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityDetailsService = { getOrderDetails: jest.fn() } as unknown as IntegrityDetailsService

describe('Integrity summary Controller', () => {
  let controller: IntegritySummaryController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new IntegritySummaryController(auditService, integrityDetailsService)
    expect(controller).not.toBeNull()
  })

  describe('Summary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new IntegritySummaryController(auditService, integrityDetailsService)

      req = createMockRequest({
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      controller.summary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_ORDER_SUMMARY_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderServiceParams: OrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }

      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      await controller.summary(req, res, next)

      expect(integrityDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      integrityDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.summary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        orderDetails: expectedOrderDetails,
        backUrl: '/integrity',
        reports: {
          orderDetails: true,
          visitDetails: true,
          equipmentDetails: true,
          suspensionOfVisits: true,
          allEventHistory: true,
          services: true,
        },
      }

      integrityDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/summary', expectedPageData)
    })
  })
})
