import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'
import config from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import mockOrderInformation from './mockData/orderInformation'

describe('EM Datastore Search Client', () => {
  let fakeClient: nock.Scope
  let datastoreClient: DatastoreClient

  const token = 'token-1'

  const searchItem: Order = {
    dataType: 'am',
    legacySubjectId: 123,
  }

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
    it('should return a list of orders from the API', async () => {
      fakeClient
        .post('/search/orders', searchOrder.data)
        .matchHeader('authorization', `Bearer ${token}`)
        .matchHeader('X-User-Token', searchOrder.userToken)
        .reply(200, orders)

      const expected: Order[] = orders

      const results = await datastoreClient.searchOrders(searchOrder)

      expect(results).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient
        .post('/search/orders', searchOrder.data)
        .matchHeader('authorization', `Bearer ${token}`)
        .matchHeader('X-User-Token', searchOrder.userToken)
        .reply(401)

      await expect(datastoreClient.searchOrders(searchOrder)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getCases', () => {
    const expected: Order = orders[0]

    it('should return a single order from the api', async () => {
      fakeClient
        .get(`/search/cases/${searchItem.legacySubjectId}`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expected)
      const results = await datastoreClient.getCases(searchItem)
      expect(results).toEqual(expected)
    })
  })

  it('should handle 404 Not Found when the case does not exist', async () => {
    fakeClient
      .get(`/search/cases/${searchItem.legacySubjectId}`)
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(404)

    await expect(datastoreClient.getCases(searchItem)).rejects.toThrow('Not Found')
  })

  it('should handle 401 Unauthorized when the token is invalid', async () => {
    fakeClient
      .get(`/search/cases/${searchItem.legacySubjectId}`)
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(401)

    await expect(datastoreClient.getCases(searchItem)).rejects.toThrow('Unauthorized')
  })

  describe('getOrderSummary', () => {
    it('should fetch order summary with correct parameters', async () => {
      const expectedResult = mockOrderInformation

      fakeClient
        .get(`/orders/getOrderSummary/${orderInfo.orderId}`)
        .matchHeader('X-User-Token', orderInfo.userToken ?? null)
        .reply(200, expectedResult)

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
        .get(`/orders/getOrderSummary/${orderInfoWithNullToken.orderId}`)
        .matchHeader('X-User-Token', val => val === null)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getOrderSummary(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })
})
