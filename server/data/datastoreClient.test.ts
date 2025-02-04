import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'
import config from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import mockOrderInformation from './mockData/orderInformation'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

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
    it('should fetch monitoring events with correct parameters', async () => {
      const fakeResponse = {
        pageSize: 0,
        events: [] as MonitoringEvent[],
      }

      const expectedResult = [] as MonitoringEvent[]

      fakeClient.get(`/orders/${orderInfo.orderId}/monitoring-events`).reply(200, fakeResponse)

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
        .get(`/orders/${orderInfoWithNullToken.orderId}/monitoring-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getMonitoringEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getContactHistory', () => {
    it('should fetch contact history with correct parameters', async () => {
      const fakeResponse = {
        pageSize: 0,
        events: [] as ContactEvent[],
      }

      const expectedResult = [] as ContactEvent[]

      fakeClient.get(`/orders/${orderInfo.orderId}/contact-events`).reply(200, fakeResponse)

      const result = await datastoreClient.getContactHistory(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`/orders/${orderInfoWithNullToken.orderId}/contact-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getContactHistory(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIncidentEvents', () => {
    it('should fetch incident events with correct parameters', async () => {
      const fakeResponse = {
        pageSize: 0,
        events: [] as IncidentEvent[],
      }

      const expectedResult = [] as IncidentEvent[]

      fakeClient.get(`/orders/${orderInfo.orderId}/incident-events`).reply(200, fakeResponse)

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
        .get(`/orders/${orderInfoWithNullToken.orderId}/incident-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getIncidentEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSuspensionOfVisitsEvents', () => {
    it('should fetch suspension of visits events with correct parameters', async () => {
      const fakeResponse = {
        pageSize: 0,
        events: [] as SuspensionOfVisitsEvent[],
      }
      const expectedResult = [] as SuspensionOfVisitsEvent[]
      fakeClient.get(`${config.apiEndpoints.getSuspensionOfVisits}/${orderInfo.orderId}`).reply(200, fakeResponse)

      const result = await datastoreClient.getSuspensionOfVisits(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${config.apiEndpoints.getSuspensionOfVisits}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      await expect(datastoreClient.getSuspensionOfVisits(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })
})
