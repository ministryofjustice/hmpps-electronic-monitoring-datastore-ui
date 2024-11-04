import nock from 'nock'
import DatastoreSearchClient from './datastoreSearchClient'
import orders from './mockData/orders'

describe('EM Datastore Search Client', () => {
  let datastoreSearchClient: DatastoreSearchClient

  const token = 'token-1'

  beforeEach(() => {
    datastoreSearchClient = new DatastoreSearchClient(token)
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

      const results = await datastoreSearchClient.getOrders()
      expect(results.length).toEqual(expectedResults.length)
    })
  })
})
