import EmDatastoreCurfewTimetableService from './emDatastoreCurfewTimetableService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { CurfewTimetable } from '../models/curfewTimetable'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Visit Details Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let curfewTimetableService: EmDatastoreCurfewTimetableService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    curfewTimetableService = new EmDatastoreCurfewTimetableService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getCurfewTimetable', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const curfewTimetableResponse = [] as CurfewTimetable[]

    const expectedResult = [] as CurfewTimetable[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getCurfewTimetable.mockResolvedValue(curfewTimetableResponse)

      const results = await curfewTimetableService.getCurfewTimetable(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting suspensions of visits', async () => {
      emDatastoreApiClient.getCurfewTimetable.mockRejectedValue(new Error('some error'))

      await expect(curfewTimetableService.getCurfewTimetable(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
