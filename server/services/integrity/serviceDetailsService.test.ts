import IntegrityServiceDetailService from './serviceDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityServiceDetail } from '../../models/integrity/serviceDetail'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Service Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let integrityServiceDetailService: IntegrityServiceDetailService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    integrityServiceDetailService = new IntegrityServiceDetailService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const serviceDetailsResponse = [] as IntegrityServiceDetail[]

    const expectedResult = [] as IntegrityServiceDetail[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockResolvedValue(serviceDetailsResponse)

      const results = await integrityServiceDetailService.getServiceDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockRejectedValue(new Error('some error'))

      await expect(integrityServiceDetailService.getServiceDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving service details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(integrityServiceDetailService.getServiceDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving service details: some error'),
      )
    })
  })
})
