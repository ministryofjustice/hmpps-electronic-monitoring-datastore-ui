import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'
import config from '../config'
import { Order } from '../interfaces/order'

describe('EM Datastore Search Client', () => {
  let fakeClient: nock.Scope
  let datastoreClient: DatastoreClient

  const token = 'token-1'

  const searchItem: Order = {
    dataType: 'am',
    legacySubjectId: 123,
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

  describe('getOrders', () => {
    it('should return a list of prders from the api', async () => {
      const expected: Order[] = orders
      const results = await datastoreClient.searchForOrders(searchItem)
      expect(results).toEqual(expected)
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
})
