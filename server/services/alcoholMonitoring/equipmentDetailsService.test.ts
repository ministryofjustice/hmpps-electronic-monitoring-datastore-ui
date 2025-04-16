import AlcoholMonitoringEquipmentDetailsService from './equipmentDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringEquipmentDetails } from '../../models/alcoholMonitoring/equipmentDetails'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Equipment Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringEquipmentDetailsService: AlcoholMonitoringEquipmentDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(
      emDatastoreApiClientFactory,
      hmppsAuthClient,
    )
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const equipmentDetailsResponse = [] as AlcoholMonitoringEquipmentDetails[]

    const expectedResult = [] as AlcoholMonitoringEquipmentDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails.mockResolvedValue(equipmentDetailsResponse)

      const results = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringEquipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of equipment details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(alcoholMonitoringEquipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of equipment details: some error'),
      )
    })
  })
})
