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
      legacySubjectId: '123',
    }
    const suspensionOfVisitsResponse = [] as SuspensionOfVisitsEvent[]
    const expectedResult = [] as SuspensionOfVisitsEvent[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getSuspensionOfVisits.mockResolvedValue(suspensionOfVisitsResponse)

      const results = await suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getSuspensionOfVisits.mockRejectedValue(new Error('some error'))

      await expect(suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)).rejects.toEqual(
        new Error('Error retrieving suspension of visits data: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getSuspensionOfVisits.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)).rejects.toEqual(
        new Error('Error retrieving suspension of visits data: some error'),
      )
    })
  })
})
