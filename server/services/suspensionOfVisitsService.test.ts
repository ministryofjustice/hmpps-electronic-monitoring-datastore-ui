import SuspensionOfVisitsService from './suspensionOfVisitsService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { SuspensionOfVisits } from '../models/suspensionOfVisits'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let suspensionOfVisitsService: SuspensionOfVisitsService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    suspensionOfVisitsService = new SuspensionOfVisitsService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getSuspensionOfVisits', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const suspensionOfVisitsResponse = [] as SuspensionOfVisits[]

    const expectedResult = [] as SuspensionOfVisits[]

    it('should return data from the client', async () => {
      datastoreClient.getSuspensionOfVisits.mockResolvedValue(suspensionOfVisitsResponse)

      const results = await suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting suspensions of visits', async () => {
      datastoreClient.getSuspensionOfVisits.mockRejectedValue(new Error('some error'))

      await expect(suspensionOfVisitsService.getSuspensionOfVisits(orderRequest)).rejects.toEqual(
        new Error('some error'),
      )
    })
  })
})
