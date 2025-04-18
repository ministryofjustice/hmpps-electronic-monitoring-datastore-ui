import IntegritySuspensionOfVisitsService from './suspensionOfVisitsService'
import { createMockEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegritySuspensionOfVisitsEvent } from '../../models/integrity/suspensionOfVisits'

jest.mock('../../data/emDatastoreApiClient')

describe('Integrity suspension of visits service', () => {
  const emDatastoreApiClient = createMockEmDatastoreApiClient()
  let suspensionOfVisitsService: IntegritySuspensionOfVisitsService

  beforeEach(() => {
    suspensionOfVisitsService = new IntegritySuspensionOfVisitsService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getSuspensionOfVisits', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }
    const suspensionOfVisitsResponse = [] as IntegritySuspensionOfVisitsEvent[]
    const expectedResult = [] as IntegritySuspensionOfVisitsEvent[]

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
