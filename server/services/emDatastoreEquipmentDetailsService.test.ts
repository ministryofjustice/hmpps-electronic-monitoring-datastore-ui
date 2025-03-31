import EmDatastoreEquipmentDetailsService from './emDatastoreEquipmentDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { EquipmentDetails } from '../models/equipmentDetails'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Equipment Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let equipmentDetailsService: EmDatastoreEquipmentDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    equipmentDetailsService = new EmDatastoreEquipmentDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const equipmentDetailsResponse = [] as EquipmentDetails[]

    const expectedResult = [] as EquipmentDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getEquipmentDetails.mockResolvedValue(equipmentDetailsResponse)

      const results = await equipmentDetailsService.getEquipmentDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting equipment details', async () => {
      emDatastoreApiClient.getEquipmentDetails.mockRejectedValue(new Error('some error'))

      await expect(equipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
