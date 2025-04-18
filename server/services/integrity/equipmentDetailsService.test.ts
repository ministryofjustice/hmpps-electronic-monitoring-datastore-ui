import IntegrityEquipmentDetailsService from './equipmentDetailsService'
import { createMockEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityEquipmentDetails } from '../../models/integrity/equipmentDetails'

jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Equipment Details Service', () => {
  const emDatastoreApiClient = createMockEmDatastoreApiClient()

  let integrityEquipmentDetailsService: IntegrityEquipmentDetailsService

  beforeEach(() => {
    integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const equipmentDetailsResponse = [] as IntegrityEquipmentDetails[]

    const expectedResult = [] as IntegrityEquipmentDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getIntegrityEquipmentDetails.mockResolvedValue(equipmentDetailsResponse)

      const results = await integrityEquipmentDetailsService.getEquipmentDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegrityEquipmentDetails.mockRejectedValue(new Error('some error'))

      await expect(integrityEquipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of equipment details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegrityEquipmentDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(integrityEquipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of equipment details: some error'),
      )
    })
  })
})
