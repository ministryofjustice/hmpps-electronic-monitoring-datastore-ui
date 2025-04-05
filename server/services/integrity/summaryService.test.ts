import EmDatastoreOrderSummaryService from './summaryService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { OrderInformation } from '../../interfaces/orderInformation'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Order summary service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let emDatastoreOrderSummaryService: EmDatastoreOrderSummaryService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    emDatastoreOrderSummaryService = new EmDatastoreOrderSummaryService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const emptyResponse = {} as OrderInformation
    const expectedResult = {} as OrderInformation

    it('should return empty data from the client', async () => {
      emDatastoreApiClient.getIntegritySummary.mockResolvedValue(emptyResponse)

      const results = await emDatastoreOrderSummaryService.getSummary(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegritySummary.mockRejectedValue(new Error('some error'))

      await expect(emDatastoreOrderSummaryService.getSummary(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order summary: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegritySummary.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(emDatastoreOrderSummaryService.getSummary(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order summary: some error'),
      )
    })
  })
})
