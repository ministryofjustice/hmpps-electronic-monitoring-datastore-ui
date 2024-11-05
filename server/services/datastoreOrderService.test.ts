import DatastoreOrderService from './datastoreOrderService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Search service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient

  const datastoreClientFactory = jest.fn()

  let datastoreSearchService: DatastoreOrderService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreSearchService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('getOrders', () => {
    const searchItem: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }
    it('should return data from the client', async () => {
      const expectedData: Order = {
        dataType: 'am',
        legacySubjectId: 1000000,
        name: 'Amy Smith',
        alias: null,
        dateOfBirth: '01-01-1970',
        orderStartDate: '08-02-2019',
      }
      const results = await datastoreSearchService.getCases(searchItem)
      console.log('results', results)
      expect(results).toEqual(expectedData)
    })
  })
  /**
   * Pass search model to getOrders
   * expect results to be returned.
   */
})
