import AlcoholMonitoringSummaryService from './summaryService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { OrderInformation } from '../../interfaces/orderInformation'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Alcohol monitoring summary service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringSummaryService: AlcoholMonitoringSummaryService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringSummaryService = new AlcoholMonitoringSummaryService(emDatastoreApiClientFactory, hmppsAuthClient)
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
      emDatastoreApiClient.getAlcoholMonitoringSummary.mockResolvedValue(emptyResponse)

      const results = await alcoholMonitoringSummaryService.getSummary(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getAlcoholMonitoringSummary.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringSummaryService.getSummary(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order summary: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getAlcoholMonitoringSummary.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(alcoholMonitoringSummaryService.getSummary(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order summary: some error'),
      )
    })
  })
})
