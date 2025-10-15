import nock from 'nock'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import config, { ApiConfig } from '../config'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'

describe('Datastore Search Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let emDatastoreOrderSearchService: EmDatastoreOrderSearchService

  const queryExecutionId = 'query-execution-id'
  const queryExecutionResponse = {
    queryExecutionId,
  }

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(emDatastoreApiClient)
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

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('submitSearchQuery', () => {
    it('submits a search query and returns an order execution ID', async () => {
      const data = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      fakeClient.post(`/orders/integrity`, data).reply(200, { queryExecutionId })

      const result = await emDatastoreOrderSearchService.submitSearchQuery({
        userToken: 'token',
        data,
      })
      expect(result).toEqual(queryExecutionResponse)
    })

    it('handles errors from the datastore client', async () => {
      const data = {
        searchType: '',
        legacySubjectId: '',
        firstName: '',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }

      expect(
        emDatastoreOrderSearchService.submitSearchQuery({
          userToken: 'token',
          data,
        }),
      ).rejects.toThrow('Error submitting search query')
    })
  })
})
