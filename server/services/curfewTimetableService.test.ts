import CurfewTimetableService from './curfewTimetableService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { CurfewTimetable } from '../models/curfewTimetable'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let curfewTimetableService: CurfewTimetableService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    curfewTimetableService = new CurfewTimetableService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getCurfewTimetable', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const curfewTimetableResponse = [] as CurfewTimetable[]

    const expectedResult = [] as CurfewTimetable[]

    it('should return data from the client', async () => {
      datastoreClient.getCurfewTimetable.mockResolvedValue(curfewTimetableResponse)

      const results = await curfewTimetableService.getCurfewTimetable(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting suspensions of visits', async () => {
      datastoreClient.getCurfewTimetable.mockRejectedValue(new Error('some error'))

      await expect(curfewTimetableService.getCurfewTimetable(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
