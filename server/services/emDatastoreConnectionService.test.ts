import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import EmDatastoreConnectionService from './emDatastoreConnectionService'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import config from '../config'

describe('EM Datastore connection service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let emDatastoreConnectionService: EmDatastoreConnectionService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    emDatastoreConnectionService = new EmDatastoreConnectionService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('test', () => {
    it('should test', async () => {
      const expectedResult = {
        foo: 'bar',
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/test`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await emDatastoreConnectionService.test('test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/test`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(emDatastoreConnectionService.test('test-system-token')).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/test`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(emDatastoreConnectionService.test('test-system-token')).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: Internal Server Error'),
      )
    })
  })
})
