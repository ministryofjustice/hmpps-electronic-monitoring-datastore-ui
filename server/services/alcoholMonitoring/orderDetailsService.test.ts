import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AlcoholMonitoringOrderDetailsService from './orderDetailsService'

import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'

describe('Alcohol Monitoring order summary Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let alcoholMonitoringOrderDetailsService: AlcoholMonitoringOrderDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    alcoholMonitoringOrderDetailsService = new AlcoholMonitoringOrderDetailsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Internal Server Error'))
    })
  })

  describe('getSearchResults', () => {
    const userToken = 'test-system-token'
    const queryExecutionId = 'query-execution-id'

    it('submits a request containing a query execution ID and returns search results', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring?id=${queryExecutionId}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, [])

      const result = await alcoholMonitoringOrderDetailsService.getSearchResults({
        userToken,
        queryExecutionId,
      })

      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        nock(config.apis.emDatastoreApi.url)
          .get(`/orders/alcohol-monitoring?id=`)
          .matchHeader('authorization', 'Bearer test-system-token')
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
        nock(config.apis.emDatastoreApi.url)
          .get(`/orders/alcohol-monitoring?id=`)
          .matchHeader('authorization', 'Bearer test-system-token')
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
