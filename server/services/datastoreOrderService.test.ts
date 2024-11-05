import DatastoreOrderService from './datastoreOrderService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Search service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let datastoreOrderService: DatastoreOrderService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('getCases', () => {
    const searchItem: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }
    it('should return data from the client', async () => {
      const expectedData: Order = orders[0]
      datastoreClient.getCases.mockResolvedValue(expectedData)

      const results = await datastoreOrderService.getCases(searchItem)
      console.log('results', results)
      expect(results).toEqual(expectedData)
    })
  })
  /**
   * Pass search model to getOrders
   * expect results to be returned.
   */
})
