import EmDatastoreCurfewTimetableService from './emDatastoreCurfewTimetableService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { IntegrityServiceDetail } from '../models/integrity/serviceDetail'

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

    const curfewTimetableResponse = [] as IntegrityServiceDetail[]

    const expectedResult = [] as IntegrityServiceDetail[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockResolvedValue(curfewTimetableResponse)

      const results = await curfewTimetableService.getCurfewTimetable(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockRejectedValue(new Error('some error'))

      await expect(curfewTimetableService.getCurfewTimetable(orderRequest)).rejects.toEqual(
        new Error('Error retrieving curfew timetable: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.getIntegrityServiceDetails.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(curfewTimetableService.getCurfewTimetable(orderRequest)).rejects.toEqual(
        new Error('Error retrieving curfew timetable: some error'),
      )
    })
  })
})
