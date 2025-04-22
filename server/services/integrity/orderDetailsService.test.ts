import nock from 'nock'
import IntegrityOrderDetailsService from './orderDetailsService'

import { IntegrityOrderDetails } from '../../models/integrity/orderDetails'
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
        offenceRisk: null,
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

      fakeClient.get(`/orders/integrity/${legacySubjectId}/details`).reply(200, expectedResult)

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
        offenceRisk: null,
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

      fakeClient.get(`/orders/integrity/${legacySubjectId}/details`).reply(200, expectedResult)

      const result = await integrityOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/details`).reply(401)

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/details`).replyWithError('Fake unexpected server error')

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Fake unexpected server error'))
    })
  })
})
