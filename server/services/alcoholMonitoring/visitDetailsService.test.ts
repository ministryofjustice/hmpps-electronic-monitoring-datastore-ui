import AlcoholMonitoringVisitDetailsService from './visitDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringVisitDetails } from '../../models/alcoholMonitoring/visitDetails'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Alcohol Monitoring Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringVisitDetailsService: AlcoholMonitoringVisitDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(
      emDatastoreApiClientFactory,
      hmppsAuthClient,
    )
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVisitDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const visitDetailsResponse = [] as AlcoholMonitoringVisitDetails[]

    const expectedResult = [] as AlcoholMonitoringVisitDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getAlcoholMonitoringVisitDetails.mockResolvedValue(visitDetailsResponse)

      const results = await alcoholMonitoringVisitDetailsService.getVisitDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getAlcoholMonitoringVisitDetails.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringVisitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of visit details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getAlcoholMonitoringVisitDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(alcoholMonitoringVisitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of visit details: some error'),
      )
    })
  })
})
