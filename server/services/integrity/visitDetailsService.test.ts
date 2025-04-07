import IntegrityVisitDetailsService from './visitDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityVisitDetails } from '../../models/integrity/visitDetails'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let integrityVisitDetailsService: IntegrityVisitDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    integrityVisitDetailsService = new IntegrityVisitDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVisitDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const visitDetailsResponse = [] as IntegrityVisitDetails[]

    const expectedResult = [] as IntegrityVisitDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getIntegrityVisitDetails.mockResolvedValue(visitDetailsResponse)

      const results = await integrityVisitDetailsService.getVisitDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegrityVisitDetails.mockRejectedValue(new Error('some error'))

      await expect(integrityVisitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of visit details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegrityVisitDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(integrityVisitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving list of visit details: some error'),
      )
    })
  })
})
