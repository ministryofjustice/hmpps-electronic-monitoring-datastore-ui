import EmDatastoreConnectionService from './emDatastoreConnectionService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Connection service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let emDatastoreConnectionService: EmDatastoreConnectionService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    emDatastoreConnectionService = new EmDatastoreConnectionService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    it('should return empty data from the client', async () => {
      emDatastoreApiClient.confirmApi.mockResolvedValue({ message: 'test' } as unknown as JSON)

      const results = await emDatastoreConnectionService.test('token')

      expect(results).toEqual({
        message: 'test',
      })
    })

    it('should propagate an error if the apiClient rejects with an error', async () => {
      emDatastoreApiClient.confirmApi.mockRejectedValue(new Error('some error'))

      await expect(emDatastoreConnectionService.test('token')).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: some error'),
      )
    })

    it('should propagate an error if there is an error thrown by the apiClient', async () => {
      emDatastoreApiClient.confirmApi.mockImplementation(() => {
        throw new Error('some error')
      })

      await expect(emDatastoreConnectionService.test(token)).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: some error'),
      )
    })
  })
})
