import VisitDetailsService from './visitDetailsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { VisitDetails } from '../models/visitDetails'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let visitDetailsService: VisitDetailsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    visitDetailsService = new VisitDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVisitDetails', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const visitDetailsResponse = [] as VisitDetails[]

    const expectedResult = [] as VisitDetails[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getVisitDetails.mockResolvedValue(visitDetailsResponse)

      const results = await visitDetailsService.getVisitDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting visit details', async () => {
      emDatastoreApiClient.getVisitDetails.mockRejectedValue(new Error('some error'))

      await expect(visitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
