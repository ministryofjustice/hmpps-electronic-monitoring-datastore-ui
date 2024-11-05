import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreSearchClient } from '../data/testUtils/mocks'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreSearchClient')

describe('Search service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreSearchClient = createDatastoreSearchClient

  const datastoreSearchClientFactory = jest.fn()

  let datastoreSearchService: DatastoreSearchService

  beforeEach(() => {
    datastoreSearchClientFactory.mockReturnValue(datastoreSearchClient)
    datastoreSearchService = new DatastoreSearchService(datastoreSearchClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('getOrders', () => {
    it('should return data from the client', async () => {
      const expectedData = orders
      const results = await datastoreSearchService.getOrders()
      expect(results).toBe(expectedData)
    })
  })
})
