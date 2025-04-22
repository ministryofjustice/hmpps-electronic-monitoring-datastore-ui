import nock from 'nock'
import EmDatastoreApiClient from './emDatastoreApiClient'
import orders from './mockData/orders'
import config, { ApiConfig } from '../config'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'

describe('EM Datastore API Client', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  const userToken: string = 'mockUserToken'
  const queryExecutionId: string = 'query-execution-id'
  const queryExecutionResponse: QueryExecutionResponse = {
    queryExecutionId,
  }

  const searchQuery: SearchFormInput = {
    userToken,
    data: {
      searchType: 'am',
      legacySubjectId: '123',
      firstName: 'John',
      lastName: 'Doe',
      alias: 'JD',
      dobDay: '01',
      dobMonth: '01',
      dobYear: '1990',
    },
  }

  const resultsRequest: SearchResultsRequest = {
    userToken,
    queryExecutionId,
  }

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('submitSearchQuery', () => {
    it('should return a queryExecutionId from the API', async () => {
      fakeClient
        .post('/orders', searchQuery.data)
        .matchHeader('Authorization', `Bearer ${userToken}`)
        .reply(200, queryExecutionResponse)

      const result = await emDatastoreApiClient.submitSearchQuery(searchQuery, userToken)

      expect(result).toEqual(queryExecutionResponse)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post('/orders', searchQuery.data).matchHeader('Authorization', `Bearer ${userToken}`).reply(401)

      await expect(emDatastoreApiClient.submitSearchQuery(searchQuery, userToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSearchResults', () => {
    it('should return a list of orders from the API', async () => {
      fakeClient
        .get(`/orders?id=${queryExecutionId}`)
        .matchHeader('Authorization', `Bearer ${userToken}`)
        .reply(200, orders)

      const expected = orders

      const result = await emDatastoreApiClient.getSearchResults(resultsRequest, userToken)

      expect(result).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.get(`/orders?id=${queryExecutionId}`).matchHeader('Authorization', `Bearer ${userToken}`).reply(401)

      await expect(emDatastoreApiClient.getSearchResults(resultsRequest, userToken)).rejects.toThrow('Unauthorized')
    })
  })
})
