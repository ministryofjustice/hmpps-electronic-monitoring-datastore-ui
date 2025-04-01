import EmDatastoreOrderDetailsService from './emDatastoreOrderDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { OrderDetails } from '../interfaces/orderDetails'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Order Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let emDatastoreOrderDetailsService: EmDatastoreOrderDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    emDatastoreOrderDetailsService = new EmDatastoreOrderDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const emptyResponse = {} as OrderDetails
    const expectedResult = {} as OrderDetails

    it('should return empty data from the client', async () => {
      emDatastoreApiClient.getOrderDetails.mockResolvedValue(emptyResponse)

      const results = await emDatastoreOrderDetailsService.getOrderDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getOrderDetails.mockRejectedValue(new Error('some error'))

      await expect(emDatastoreOrderDetailsService.getOrderDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getOrderDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(emDatastoreOrderDetailsService.getOrderDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })
  })
})
