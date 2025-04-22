import nock from 'nock'
import AlcoholMonitoringOrderDetailsService from './orderDetailsService'

import { AlcoholMonitoringOrderDetails } from '../../models/alcoholMonitoring/orderDetails'
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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/details`).reply(200, expectedResult)

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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/details`).reply(200, expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/details`).reply(401)

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order details: Fake unexpected server error'))
    })
  })
})
