import nock from 'nock'
import AlcoholMonitoringOrderDetailsService from './orderDetailsService'

import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring order summary Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringOrderDetailsService: AlcoholMonitoringOrderDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringOrderDetailsService = new AlcoholMonitoringOrderDetailsService(emDatastoreApiClient)
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

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        sex: null,
        specialInstructions: null,
        phoneNumber: null,
        address1: null,
        address2: null,
        address3: null,
        postcode: null,
        orderStartDate: null,
        orderEndDate: null,
        enforceableCondition: null,
        orderType: null,
        orderTypeDescription: null,
        orderEndOutcome: null,
        responsibleOrganisationPhoneNumber: null,
        responsibleOrganisationEmail: null,
        tagAtSource: null,
      } as AlcoholMonitoringOrderDetails

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(200, expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        sex: null,
        specialInstructions: null,
        phoneNumber: null,
        address1: null,
        address2: null,
        address3: null,
        postcode: null,
        orderStartDate: null,
        orderEndDate: null,
        enforceableCondition: null,
        orderType: null,
        orderTypeDescription: null,
        orderEndOutcome: null,
        responsibleOrganisationPhoneNumber: null,
        responsibleOrganisationEmail: null,
        tagAtSource: null,
      } as AlcoholMonitoringOrderDetails

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(200, expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(401)

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Fake unexpected server error'))
    })
  })

  describe('getSearchResults', () => {
    const userToken = 'fake-user-token'
    const queryExecutionId = 'query-execution-id'

    it('submits a request containing a query execution ID and returns search results', async () => {
      fakeClient.get(`/orders/alcohol-monitoring?id=${queryExecutionId}`).reply(200, [])

      const result = await alcoholMonitoringOrderDetailsService.getSearchResults({
        userToken,
        queryExecutionId,
      })

      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        fakeClient
          .get(`/orders/alcohol-monitoring?id=`)
          .reply(500, {
            status: 500,
            userMessage: '',
            developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
          })
          .persist()

        await expect(
          alcoholMonitoringOrderDetailsService.getSearchResults({
            userToken,
            queryExecutionId: '',
          }),
        ).rejects.toThrow('Error retrieving search results: Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        fakeClient
          .get(`/orders/alcohol-monitoring?id=`)
          .reply(500, {
            status: 500,
            errorCode: null,
            userMessage:
              "Unexpected error: The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
            developerMessage:
              "The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
            moreInfo: null,
          })
          .persist()

        await expect(
          alcoholMonitoringOrderDetailsService.getSearchResults({
            userToken,
            queryExecutionId: '',
          }),
        ).rejects.toThrow('Error retrieving search results: Internal Server Error')
      })
    })
  })
})
