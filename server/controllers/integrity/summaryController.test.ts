import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import EmDatastoreOrderSummaryService from '../../services/integrity/summaryService'
import OrderSummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../types/OrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/summaryService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreOrderSummaryService = { getOrderSummary: jest.fn() } as unknown as EmDatastoreOrderSummaryService

describe('Integrity summary Controller', () => {
  let controller: OrderSummaryController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new OrderSummaryController(auditService, emDatastoreOrderSummaryService)
    expect(controller).not.toBeNull()
  })

  describe('OrderSummary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new OrderSummaryController(auditService, emDatastoreOrderSummaryService)

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
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      controller.orderSummary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_INFORMATION_PAGE, expectedLogData)
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

      await controller.orderSummary(req, res, next)

      expect(emDatastoreOrderSummaryService.getOrderSummary).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      emDatastoreOrderSummaryService.getOrderSummary = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.orderSummary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        data: expectedOrderDetails,
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

      emDatastoreOrderSummaryService.getOrderSummary = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.orderSummary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/summary', expectedPageData)
    })
  })
})
