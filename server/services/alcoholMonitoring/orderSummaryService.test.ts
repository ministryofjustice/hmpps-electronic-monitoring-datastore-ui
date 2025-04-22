import nock from 'nock'
import AlcoholMonitoringOrderSummaryService from './orderSummaryService'

import { AlcoholMonitoringOrderSummary } from '../../models/alcoholMonitoring/orderSummary'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring order summary Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringOrderSummaryService: AlcoholMonitoringOrderSummaryService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringOrderSummaryService = new AlcoholMonitoringOrderSummaryService(emDatastoreApiClient)
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
        firstName: 'Testy',
        lastName: 'McTestFace',
        alias: 'Mr. T',
        dateOfBirth: '2002-03-04T05:06:07',
        address1: 'line 1',
        address2: 'line 2',
        address3: 'line 3',
        postcode: 'line 5',
        orderStartDate: '2002-03-04T05:06:07',
        orderEndDate: '2002-03-04T05:06:07',
      } as AlcoholMonitoringOrderSummary

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(200, expectedResult)

      const result = await alcoholMonitoringOrderSummaryService.getOrderSummary({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        address1: null,
        address2: null,
        address3: null,
        postcode: null,
        orderStartDate: null,
        orderEndDate: null,
      } as AlcoholMonitoringOrderSummary

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(200, expectedResult)

      const result = await alcoholMonitoringOrderSummaryService.getOrderSummary({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).reply(401)

      await expect(
        alcoholMonitoringOrderSummaryService.getOrderSummary({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order summary: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}`).replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringOrderSummaryService.getOrderSummary({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order summary: Fake unexpected server error'))
    })
  })
})
