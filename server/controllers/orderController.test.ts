import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreOrderService } from '../services'
import { Page } from '../services/auditService'
import OrderController from './orderController'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { OrderRequest } from '../types/OrderRequest'

jest.mock('../services/auditService')
jest.mock('../services/datastoreOrderService')
jest.mock('../utils/tabulateOrders', () => jest.fn((): unknown[] => ['mockOrders']))

const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = {
  logPageView: jest.fn(),
} as unknown as AuditService

const datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)

describe('OrderController', () => {
  let orderController: OrderController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    orderController = new OrderController(auditService, datastoreOrderService)
    expect(orderController).not.toBeNull()
  })

  describe('OrderSummary', () => {
    beforeEach(() => {
      orderController = new OrderController(auditService, datastoreOrderService)

      req = createMockRequest({
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      orderController.orderSummary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_INFORMATION_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct orderId parameter`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderServiceParams: OrderRequest = {
        userToken: 'fakeUserToken',
        orderId: expectedOrderId,
      }
      req = createMockRequest({
        params: {
          orderId: expectedOrderId,
        },
      })

      await orderController.orderSummary(req, res, next)

      expect(datastoreOrderService.getOrderSummary).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      datastoreOrderService.getOrderSummary = jest.fn().mockImplementation(() => {
        throw new Error('Error message')
      })

      await orderController.orderSummary(req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Error fetching data')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        data: expectedOrderDetails,
        backUrl: '/search/results',
        reports: {
          orderDetails: true,
          visitDetails: true,
          equipmentDetails: true,
          suspensionOfVisits: true,
          allEventHistory: true,
          services: true,
        },
      }

      datastoreOrderService.getOrderSummary = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await orderController.orderSummary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/orderInformation', expectedPageData)
    })
  })
})
