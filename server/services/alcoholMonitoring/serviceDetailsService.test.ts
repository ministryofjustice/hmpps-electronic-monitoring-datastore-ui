import AlcoholMonitoringServiceDetailService from './serviceDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringServiceDetail } from '../../models/alcoholMonitoring/serviceDetail'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Alcohol Monitoring Service Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringServiceDetailService: AlcoholMonitoringServiceDetailService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringServiceDetailService = new AlcoholMonitoringServiceDetailService(
      emDatastoreApiClientFactory,
      hmppsAuthClient,
    )
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const serviceDetailsResponse = [] as AlcoholMonitoringServiceDetail[]

    const expectedResult = [] as AlcoholMonitoringServiceDetail[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getAlcoholMonitoringServiceDetails.mockResolvedValue(serviceDetailsResponse)

      const results = await alcoholMonitoringServiceDetailService.getServiceDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getAlcoholMonitoringServiceDetails.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringServiceDetailService.getServiceDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving service details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getAlcoholMonitoringServiceDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(alcoholMonitoringServiceDetailService.getServiceDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving service details: some error'),
      )
    })
  })
})
