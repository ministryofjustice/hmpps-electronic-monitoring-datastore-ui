import nock from 'nock'
import AlcoholMonitoringServiceDetailService from './serviceDetailsService'

import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring Service Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringServiceDetailService: AlcoholMonitoringServiceDetailService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringServiceDetailService = new AlcoholMonitoringServiceDetailService(emDatastoreApiClient)
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

  describe('getServiceDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
      ]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: '456',
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: '789',
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
      ]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as AlcoholMonitoringServiceDetails[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`).reply(401)

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Fake unexpected server error'))
    })
  })
})
