import EmDatastoreOrderSummaryService from './summaryService'
import { createMockEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderSummary } from '../../interfaces/integrity/orderSummary'

jest.mock('../../data/emDatastoreApiClient')

describe('Order summary service', () => {
  const emDatastoreApiClient = createMockEmDatastoreApiClient()

  let emDatastoreOrderSummaryService: EmDatastoreOrderSummaryService

  beforeEach(() => {
    emDatastoreOrderSummaryService = new EmDatastoreOrderSummaryService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const emptyResponse = {} as IntegrityOrderSummary
    const expectedResult = {} as IntegrityOrderSummary

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
