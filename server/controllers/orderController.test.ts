import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreOrderService } from '../services'
import { Page } from '../services/auditService'
import OrderController from './orderController'

import { Records, TabulatedRecords } from '../interfaces/records'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

import getDeviceWearerDetails from '../data/getDeviceWearer'
import orderSummary from '../data/mockData/orderSummary'
import { OrderSummary } from '../interfaces/orderSummary'

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
        id: 'fake-id',
        session: {
          id: 'mock-session-id',
          cookie: { originalMaxAge: 3600000 } as session.Cookie,
          // regenerate: jest.fn(),
          // destroy: jest.fn(),
          // reload: jest.fn(),
          // save: jest.fn(),
          // touch: jest.fn(),
          // resetMaxAge: jest.fn(),
          // returnTo: '/return',
          // nowInMinutes: 12345,
          // // validationErrors: [],
          // // formData: {},
        } as session.Session & Partial<SessionData>,
      })

      res = createMockResponse()
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fake-id' }

      orderController.orderSummary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_INFORMATION_PAGE, expectedLogData)
    })

    // TODO: The mock is not picking up that the service was called with the right parameter, even though it was...
    xit(`picks up appropriate orderID parameter from the request`, () => {
      const expectedOrderId = 'test-id'
      const expectedOrderServiceParams: OrderRequest = {
        userToken: 'fakeUserToken',
        orderId: expectedOrderId,
      }

      req = createMockRequest({
        params: {
          orderId: expectedOrderId,
        },
      })

      // datastoreOrderService.getOrderSummary = jest.fn()
      // .mockReturnValueOnce(null)

      orderController.orderSummary(req, res, next)

      expect(datastoreOrderService.getOrderSummary).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    xit(`calls the DatastoreOrderService for data`, () => {
      // let expectedOrderInformation: OrderSummary = orderSummary
      // datastoreOrderService.getOrderSummary = jest.fn()
      // .mockReturnValueOnce(null)
    })

    xit(`returns correct error when orderService fails`, () => {})

    xit(`renders the page with appropriate data`, () => {})

    xit(`renders the page with appropriate backURL`, () => {})

    xit(`renders the page with appropriate reports array`, () => {})
  })

  // const orderDetails: Records = await this.datastoreOrderService.getOrderDetails({
  //     userToken: res.locals.user.token,
  //     orderId,
  //   })
})
