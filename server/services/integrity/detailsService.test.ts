import IntegrityDetailsService from './detailsService'
import { createMockEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderDetails } from '../../models/integrity/orderDetails'

jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Details Service', () => {
  const emDatastoreApiClient = createMockEmDatastoreApiClient()

  let integrityDetailsService: IntegrityDetailsService

  beforeEach(() => {
    integrityDetailsService = new IntegrityDetailsService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getDetails', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const emptyResponse = {} as IntegrityOrderDetails
    const expectedResult = {} as IntegrityOrderDetails

    it('should return empty data from the client', async () => {
      emDatastoreApiClient.getIntegrityDetails.mockResolvedValue(emptyResponse)

      const results = await integrityDetailsService.getDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegrityDetails.mockRejectedValue(new Error('some error'))

      await expect(integrityDetailsService.getDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegrityDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(integrityDetailsService.getDetails(orderRequest)).rejects.toEqual(
        new Error('Error retrieving order details: some error'),
      )
    })
  })
})
