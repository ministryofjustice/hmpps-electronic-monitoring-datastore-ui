import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService, { Page } from '../../../services/auditService'
import EmDatastoreOrderDetailsService from '../../../services/emDatastoreOrderDetailsService'
import OrderDetailsController from './orderDetailsController'
import { createMockRequest, createMockResponse } from '../../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../../types/OrderRequest'

jest.mock('../../../services/auditService')
jest.mock('../../../services/emDatastoreOrderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreOrderDetailsService = { getOrderDetails: jest.fn() } as unknown as EmDatastoreOrderDetailsService

describe('OrderDetailsController', () => {
  let controller: OrderDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new OrderDetailsController(auditService, emDatastoreOrderDetailsService)
    expect(controller).not.toBeNull()
  })

  describe('OrderDetails', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new OrderDetailsController(auditService, emDatastoreOrderDetailsService)

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

      controller.orderDetails(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_DETAILS_PAGE, expectedLogData)
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

      await controller.orderDetails(req, res, next)

      expect(emDatastoreOrderDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderDetailsService fails`, async () => {
      emDatastoreOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.orderDetails(req, res, next)).rejects.toThrow('Expected error message')
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

      emDatastoreOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.orderDetails(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/integrity/details', expectedPageData)
    })
  })
})
