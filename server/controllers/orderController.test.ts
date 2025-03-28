import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreOrderService } from '../services'
import { Page } from '../services/auditService'
import OrderController from './orderController'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { OrderRequest } from '../types/OrderRequest'
import tabluateRecords from '../utils/tabulateRecords'
import { formatOrderDetails } from '../models/orderDetails'

jest.mock('../services/auditService')
jest.mock('../services/datastoreOrderService')
jest.mock('../utils/tabulateRecords', () => jest.fn(() => 'mock-tabulated-data'))
jest.mock('../models/orderDetails', () => ({
  formatOrderDetails: { parse: jest.fn() },
}))

const hmppsAuthClient = createMockHmppsAuthClient()
const emDatastoreApiClient = createEmDatastoreApiClient()
const emDatastoreApiClientFactory = jest.fn()
emDatastoreApiClientFactory.mockResolvedValue(emDatastoreApiClient)
const auditService = {
  logPageView: jest.fn(),
} as unknown as AuditService

const datastoreOrderService = new DatastoreOrderService(emDatastoreApiClientFactory, hmppsAuthClient)

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
      jest.clearAllMocks()
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
        throw new Error('Expected error message')
      })

      await expect(orderController.orderSummary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        data: expectedOrderDetails,
        backUrl: '/search/orders',
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

  describe('OrderDetails', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      orderController = new OrderController(auditService, datastoreOrderService)

      req = createMockRequest({
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      orderController.orderDetails(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_DETAILS_PAGE, expectedLogData)
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

      await orderController.orderDetails(req, res, next)

      expect(datastoreOrderService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`calls formatOrderDetails with the expected data`, async () => {
      const expectedOrderDetails = ['expectedOrderDetails']

      datastoreOrderService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await orderController.orderDetails(req, res, next)

      expect(formatOrderDetails.parse).toHaveBeenCalledTimes(1)
      expect(formatOrderDetails.parse).toHaveBeenCalledWith(expectedOrderDetails)
    })

    it(`calls tabulateRecords with device wearer data and order data`, async () => {
      const expectedOrderId = 'testId'
      const expectedDeviceWearerData = 'expectedDeviceWearerData'
      const expectedOrderData = 'expectedOrderData'
      const mockParsedData = {
        deviceWearerData: expectedDeviceWearerData,
        orderData: expectedOrderData,
      }
      req = createMockRequest({
        params: {
          orderId: expectedOrderId,
        },
      })

      formatOrderDetails.parse = jest.fn().mockReturnValue(mockParsedData)

      await orderController.orderDetails(req, res, next)

      expect(tabluateRecords).toHaveBeenCalledTimes(2)
      expect(tabluateRecords).toHaveBeenCalledWith(
        {
          backUrl: `/orders/${expectedOrderId}/summary`,
          records: expectedDeviceWearerData,
        },
        'Device wearer data',
      )
      expect(tabluateRecords).toHaveBeenCalledWith(
        {
          backUrl: `/orders/${expectedOrderId}/summary`,
          records: expectedOrderData,
        },
        'Order data',
      )
    })

    it(`returns correct error when getOrderDetails fails`, async () => {
      datastoreOrderService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Error message')
      })

      await orderController.orderDetails(req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Error fetching data')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderDetails = 'expectedOrderDetails'

      req = createMockRequest({
        params: {
          orderId: expectedOrderId,
        },
      })

      const expectedPageData = {
        deviceWearer: 'mock-tabulated-data',
        orderDetails: 'mock-tabulated-data',
        backUrl: `/orders/${expectedOrderId}/summary`,
      }

      datastoreOrderService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await orderController.orderDetails(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/orderDetails', expectedPageData)
    })
  })
})
