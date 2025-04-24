import nock from 'nock'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import config, { ApiConfig } from '../config'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'

describe('Datastore Search Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let emDatastoreOrderSearchService: EmDatastoreOrderSearchService

  const userToken = 'fake-user-token'
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
        searchType: '',
        legacySubjectId: '',
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      fakeClient.post(`/orders`, data).reply(200, { queryExecutionId })

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

  describe('getSearchResults', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      fakeClient.get(`/orders?id=${queryExecutionId}`).reply(200, [])

      const result = await emDatastoreOrderSearchService.getSearchResults({
        userToken,
        queryExecutionId,
      })

      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore API', async () => {
        fakeClient
          .get(`/orders?id=`)
          .reply(400, {
            data: {
              status: 500,
              userMessage: '',
              developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
            },
          })
          .persist()

        await expect(
          emDatastoreOrderSearchService.getSearchResults({
            userToken,
            queryExecutionId: '',
          }),
        ).rejects.toThrow('Error retrieving search results: Bad Request')
        // ).rejects.toThrow('Error retrieving search results: Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        jest.spyOn(emDatastoreApiClient, 'get').mockImplementationOnce(() => {
          throw new Error()
        })

        const request = {
          userToken,
          queryExecutionId: '',
        }

        await expect(emDatastoreOrderSearchService.getSearchResults(request)).rejects.toThrow(
          'Error retrieving search results',
        )
      })
    })
  })
})
