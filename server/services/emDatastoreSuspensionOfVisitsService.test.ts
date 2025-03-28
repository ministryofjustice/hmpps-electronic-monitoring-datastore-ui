import EmDatastoreSuspensionOfVisitsService from './emDatastoreSuspensionOfVisitsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Suspension of visits service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()
  const emDatastoreApiClientFactory = jest.fn()
  let suspensionOfVisitsService: EmDatastoreSuspensionOfVisitsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    suspensionOfVisitsService = new EmDatastoreSuspensionOfVisitsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getSuspensionOfVisits', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }
    const suspensionOfVisitsResponse = [] as SuspensionOfVisitsEvent[]
    const expectedResult = [] as SuspensionOfVisitsEvent[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getSuspensionOfVisits.mockResolvedValue(suspensionOfVisitsResponse)

      const results = await suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error', async () => {
      emDatastoreApiClient.getSuspensionOfVisits.mockRejectedValue(new Error('some error'))

      await expect(suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)).rejects.toEqual(
        new Error('some error'),
      )
    })
  })
})
