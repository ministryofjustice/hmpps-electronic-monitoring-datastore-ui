import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'

describe('EM Datastore Search Client', () => {
  let datastoreClient: DatastoreClient

  const token = 'token-1'

  beforeEach(() => {
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
    it('should return data from the api', async () => {
      const expectedResults = orders

      const results = await datastoreClient.getOrders()
      expect(results.length).toEqual(expectedResults.length)
    })
  })
})
