import nock from 'nock'
import EmDatastoreConnectionService from './emDatastoreConnectionService'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import config, { ApiConfig } from '../config'

describe('EM Datastore connection service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let emDatastoreConnectionService: EmDatastoreConnectionService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    emDatastoreConnectionService = new EmDatastoreConnectionService(emDatastoreApiClient)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('test', () => {
    it('should test', async () => {
      const expectedResult = {
        foo: 'bar',
      }

      fakeClient.get(`/test`).reply(200, expectedResult)

      const result = await emDatastoreConnectionService.test('token')

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/test`).reply(401)

      await expect(emDatastoreConnectionService.test('token')).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/test`).replyWithError('Fake unexpected server error')

      await expect(emDatastoreConnectionService.test('token')).rejects.toEqual(
        new Error('Error connecting to EM Datastore API: Fake unexpected server error'),
      )
    })
  })
})
