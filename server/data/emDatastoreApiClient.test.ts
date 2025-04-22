import nock from 'nock'
import EmDatastoreApiClient from './emDatastoreApiClient'
import orders from './mockData/orders'
import config, { ApiConfig } from '../config'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'

describe('EM Datastore API Client', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  const token: string = 'token-1'
  const queryExecutionId: string = 'query-execution-id'
  const queryExecutionResponse: QueryExecutionResponse = {
    queryExecutionId,
  }

  const searchQuery: SearchFormInput = {
    userToken: 'mockUserToken',
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
    userToken: 'mockUserToken',
    queryExecutionId,
  }

  const orderInfo: OrderRequest = {
    userToken: 'user-token',
    legacySubjectId: '7654321',
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
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, queryExecutionResponse)

      const result = await emDatastoreApiClient.submitSearchQuery(searchQuery, token)

      expect(result).toEqual(queryExecutionResponse)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post('/orders', searchQuery.data).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(emDatastoreApiClient.submitSearchQuery(searchQuery, token)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSearchResults', () => {
    it('should return a list of orders from the API', async () => {
      fakeClient
        .get(`/orders?id=${queryExecutionId}`)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, orders)

      const expected = orders

      const result = await emDatastoreApiClient.getSearchResults(resultsRequest, token)

      expect(result).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.get(`/orders?id=${queryExecutionId}`).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(emDatastoreApiClient.getSearchResults(resultsRequest, token)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIntegritySummary', () => {
    it('should fetch the summary with correct parameters', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: 'No',
          legacySubjectId: orderInfo.legacySubjectId,
          name: 'John Smith',
          alias: 'Zeno',
          dateOfBirth: '01-02-1980',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postcode: 'ABC 123',
          orderStartDate: '01-02-2012',
          orderEndDate: '03-04-2013',
        },
        subjectHistoryReport: {
          reportUrl: '#',
          name: '1234567',
          createdOn: '01-02-2020',
          time: '0900',
        },
        documents: {
          pageSize: 0,
          orderDocuments: [] as unknown[],
        },
      }

      fakeClient.get(`/orders/integrity/${orderInfo.legacySubjectId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegritySummary(orderInfo, token)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`/orders/integrity/${orderInfoWithNullToken.legacySubjectId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegritySummary(orderInfoWithNullToken, token)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringSummary', () => {
    it('should fetch the summary with correct parameters', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: 'No',
          legacySubjectId: orderInfo.legacySubjectId,
          name: 'John Smith',
          alias: 'Zeno',
          dateOfBirth: '01-02-1980',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postcode: 'ABC 123',
          orderStartDate: '01-02-2012',
          orderEndDate: '03-04-2013',
        },
        subjectHistoryReport: {
          reportUrl: '#',
          name: '1234567',
          createdOn: '01-02-2020',
          time: '0900',
        },
        documents: {
          pageSize: 0,
          orderDocuments: [] as unknown[],
        },
      }

      fakeClient.get(`/orders/alcohol-monitoring/${orderInfo.legacySubjectId}/information`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringSummary(orderInfo, token)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/information`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringSummary(orderInfoWithNullToken, token)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityDetail', () => {
    it('should fetch the details with correct parameters', async () => {
      const expectedResult = {
        specials: 'No',
        legacySubjectId: orderInfo.legacySubjectId,
        firstName: 'John',
        lastName: 'Smith',
        alias: 'Zeno',
        dateOfBirth: '01-02-1980',
        address1: '1 Primary Street',
        address2: 'Sutton',
        address3: 'London',
        postcode: 'ABC 123',
        orderStartDate: '01-02-2012',
        orderEndDate: '03-04-2013',
      }

      fakeClient.get(`/orders/integrity/${orderInfo.legacySubjectId}/details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityDetails(orderInfo, token)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${orderInfoWithNullToken.legacySubjectId}/details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityDetails(orderInfoWithNullToken, token)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })
})
