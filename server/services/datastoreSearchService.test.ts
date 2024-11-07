import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Datastore Search Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let datastoreOrderService: DatastoreSearchService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreOrderService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('getOrders', () => {
    it('should return daata from the client', async () => {
      const searchItem: Order = {
        dataType: 'am',
        legacySubjectId: 1,
      }
      const expectedData: Order[] = orders
      datastoreClient.searchForOrders.mockResolvedValue(expectedData)

      const results = await datastoreOrderService.getOrders(searchItem)
      expect(results).toEqual(expectedData)
    })
  })
})
