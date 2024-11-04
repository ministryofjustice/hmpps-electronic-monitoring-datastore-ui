import nock from 'nock'
import DatastoreSearchClient from './datastoreSearchClient'

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
      const results = await datastoreSearchClient.getOrders()
      expect(results.length).toBeGreaterThanOrEqual(0)
    })
  })
})
