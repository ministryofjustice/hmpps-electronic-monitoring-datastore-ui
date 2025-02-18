import VisitDetailsService from './visitDetailsService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { VisitDetails } from '../models/visitDetails'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let visitDetailsService: VisitDetailsService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    visitDetailsService = new VisitDetailsService(datastoreClientFactory, hmppsAuthClient)
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
      datastoreClient.getVisitDetails.mockResolvedValue(visitDetailsResponse)

      const results = await visitDetailsService.getVisitDetails(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting visit details', async () => {
      datastoreClient.getVisitDetails.mockRejectedValue(new Error('some error'))

      await expect(visitDetailsService.getVisitDetails(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
