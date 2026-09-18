import { IntegrityDatastoreClient } from '../data'
import EmDatastoreConnectionService from './emDatastoreConnectionService'

jest.mock('../data')

describe('EM Datastore connection service', () => {
  let integrityDatastoreClient: jest.Mocked<IntegrityDatastoreClient>
  let emDatastoreConnectionService: EmDatastoreConnectionService

  beforeEach(() => {
    integrityDatastoreClient = {
      testConnection: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    emDatastoreConnectionService = new EmDatastoreConnectionService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('test', () => {
    it('should test', async () => {
      const expectedResult = {
        foo: 'bar',
      }

      integrityDatastoreClient.testConnection.mockResolvedValue(expectedResult as unknown as JSON)

      const result = await emDatastoreConnectionService.test('test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.testConnection.mockRejectedValue(new Error('Unauthorized'))

      await expect(emDatastoreConnectionService.test('test-system-token')).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.testConnection.mockRejectedValue(new Error('Internal Server Error'))

      await expect(emDatastoreConnectionService.test('test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })
})
