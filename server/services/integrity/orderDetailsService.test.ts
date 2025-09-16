import nock from 'nock'
import IntegrityOrderDetailsService from './orderDetailsService'

import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Integrity order details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityOrderDetailsService: IntegrityOrderDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityOrderDetailsService = new IntegrityOrderDetailsService(emDatastoreApiClient)
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

    it('should fetch order details', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultOrChild: null,
        sex: null,
        contact: null,
        primaryAddressLine1: null,
        primaryAddressLine2: null,
        primaryAddressLine3: null,
        primaryAddressPostCode: null,
        phoneOrMobileNumber: null,
        ppo: null,
        mappa: null,
        technicalBail: null,
        manualRisk: null,
        offenceRisk: false,
        postCodeRisk: null,
        falseLimbRisk: null,
        migratedRisk: null,
        rangeRisk: null,
        reportRisk: null,
        orderStartDate: null,
        orderEndDate: null,
        orderType: null,
        orderTypeDescription: null,
        orderTypeDetail: null,
        wearingWristPid: null,
        notifyingOrganisationDetailsName: null,
        responsibleOrganisation: null,
        responsibleOrganisationDetailsRegion: null,
      } as IntegrityOrderDetails

      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(200, expectedResult)

      const result = await integrityOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order details', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultOrChild: null,
        sex: null,
        contact: null,
        primaryAddressLine1: null,
        primaryAddressLine2: null,
        primaryAddressLine3: null,
        primaryAddressPostCode: null,
        phoneOrMobileNumber: null,
        ppo: null,
        mappa: null,
        technicalBail: null,
        manualRisk: null,
        offenceRisk: false,
        postCodeRisk: null,
        falseLimbRisk: null,
        migratedRisk: null,
        rangeRisk: null,
        reportRisk: null,
        orderStartDate: null,
        orderEndDate: null,
        orderType: null,
        orderTypeDescription: null,
        orderTypeDetail: null,
        wearingWristPid: null,
        notifyingOrganisationDetailsName: null,
        responsibleOrganisation: null,
        responsibleOrganisationDetailsRegion: null,
      } as IntegrityOrderDetails

      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(200, expectedResult)

      const result = await integrityOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(401)

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}`).replyWithError('Fake unexpected server error')

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Fake unexpected server error'))
    })
  })

  describe('getSearchResults', () => {
    const userToken = 'fake-user-token'
    const queryExecutionId = 'query-execution-id'

    it('submits a request containing a query execution ID and returns search results', async () => {
      fakeClient.get(`/orders/integrity?id=${queryExecutionId}`).reply(200, [])

      const result = await integrityOrderDetailsService.getSearchResults({
        userToken,
        queryExecutionId,
      })

      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        fakeClient
          .get(`/orders/integrity?id=`)
          .reply(500, {
            status: 500,
            userMessage: '',
            developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
          })
          .persist()

        await expect(
          integrityOrderDetailsService.getSearchResults({
            userToken,
            queryExecutionId: '',
          }),
        ).rejects.toThrow('Error retrieving search results: Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        fakeClient
          .get(`/orders/integrity?id=`)
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
          integrityOrderDetailsService.getSearchResults({
            userToken,
            queryExecutionId: '',
          }),
        ).rejects.toThrow('Error retrieving search results: Internal Server Error')
      })
    })
  })
})
