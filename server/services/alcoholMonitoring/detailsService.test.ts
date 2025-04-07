import AlcoholMonitoringDetailsService from './detailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IndegrityOrderDetails } from '../../interfaces/integrity/orderDetails'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Alcohol Monitoring Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringDetailsService: AlcoholMonitoringDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringDetailsService = new AlcoholMonitoringDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const emptyResponse = {} as IndegrityOrderDetails
    const expectedResult = {} as IndegrityOrderDetails

    it('should return empty data from the client', async () => {
      emDatastoreApiClient.getAlcoholMonitoringDetails.mockResolvedValue(emptyResponse)

      const results = await alcoholMonitoringDetailsService.getDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getAlcoholMonitoringDetails.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringDetailsService.getDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getAlcoholMonitoringDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(alcoholMonitoringDetailsService.getDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })
  })
})
