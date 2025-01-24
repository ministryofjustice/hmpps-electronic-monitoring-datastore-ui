import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreOrderService } from '../services'
import OrderController from './orderController'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

import getOrderDetails from '../data/getOrderDetails'
import getDeviceWearerDetails from '../data/getDeviceWearer'

beforeAll(() => {
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
})

it(`constructs the system under test and mocks appropriately`, () => {
  expect(DatastoreOrderService).not.toBeNull()
})

describe('OrderSummary', () => {
  xit(`logs hitting the page`, () => {})

  xit(`picks up appropriate orderID parameter from the request`, () => {})

  xit(`calls the DatastoreOrderService for data`, () => {})

  xit(`returns correct error when orderService fails`, () => {})

  xit(`renders the page with appropriate data`, () => {})

  xit(`renders the page with appropriate backURL`, () => {})

  xit(`renders the page with appropriate reports array`, () => {})
})

// const orderDetails: Records = await this.datastoreOrderService.getOrderDetails({
//     userToken: res.locals.user.token,
//     orderId,
//   })
