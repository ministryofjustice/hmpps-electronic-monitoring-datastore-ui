import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'
import config from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import mockOrderInformation from './mockData/orderInformation'
import { MonitoringEvents } from '../models/monitoringEvents'
import { ContactEvents } from '../models/contactEvents'
import { IncidentEvents } from '../models/incidentEvents'
import { ViolationEvents } from '../models/violationEvents'

describe('EM Datastore Search Client', () => {
  let fakeClient: nock.Scope
  let datastoreClient: DatastoreClient

  const token = 'token-1'

  const searchOrder: SearchFormInput = {
    userToken: 'mockUserToken',
    data: {
      searchType: 'am',
      legacySubjectId: '123',
      firstName: 'John',
      lastName: 'Doe',
      alias: 'JD',
      'dob-day': '01',
      'dob-month': '01',
      'dob-year': '1990',
    },
  }

  const orderInfo: OrderRequest = {
    userToken: 'user-token',
    orderId: '7654321',
  }

  beforeEach(() => {
    fakeClient = nock(config.apis.electronicMonitoringDatastore.url)
    datastoreClient = new DatastoreClient(token)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('searchOrders', () => {
    const endpoint = '/search/orders'

    it('should return a list of orders from the API', async () => {
      fakeClient.post(endpoint, searchOrder.data).matchHeader('Authorization', `Bearer ${token}`).reply(200, orders)

      const expected: Order[] = orders

      const results = await datastoreClient.searchOrders(searchOrder)

      expect(results).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post(endpoint, searchOrder.data).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(datastoreClient.searchOrders(searchOrder)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getOrderSummary', () => {
    const endpoint = '/orders/getOrderSummary'

    it('should fetch order summary with correct parameters', async () => {
      const expectedResult = mockOrderInformation

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getOrderSummary(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getOrderSummary(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getMonitoringEvents', () => {
    const endpoint = '/orders/getMonitoringEvents'

    it('should fetch monitoring events with correct parameters', async () => {
      const expectedResult = [] as MonitoringEvents

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getMonitoringEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getMonitoringEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getContactEvents', () => {
    const endpoint = '/orders/getContactEvents'

    it('should fetch contact history with correct parameters', async () => {
      const expectedResult = [] as ContactEvents

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getContactEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getContactEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIncidentEvents', () => {
    const endpoint = '/orders/getIncidentEvents'

    it('should fetch incident events with correct parameters', async () => {
      const expectedResult = [] as IncidentEvents

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getIncidentEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getIncidentEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getViolationEvents', () => {
    const endpoint = '/orders/getViolationEvents'

    it('should fetch violation events with correct parameters', async () => {
      const expectedResult = [] as ViolationEvents

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getViolationEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getViolationEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })
})
