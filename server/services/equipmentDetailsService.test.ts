import EquipmentDetailsService from './equipmentDetailsService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { EquipmentDetails } from '../models/equipmentDetails'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Equipment Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let equipmentDetailsService: EquipmentDetailsService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    equipmentDetailsService = new EquipmentDetailsService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEvents', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const equipmentDetailsResponse = [] as EquipmentDetails[]

    const expectedResult = [] as EquipmentDetails[]

    it('should return data from the client', async () => {
      datastoreClient.getEquipmentDetails.mockResolvedValue(equipmentDetailsResponse)

      const results = await equipmentDetailsService.getEquipmentDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting monitoring events', async () => {
      datastoreClient.getEquipmentDetails.mockRejectedValue(new Error('some error'))

      await expect(equipmentDetailsService.getEquipmentDetails(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
