import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AlcoholMonitoringServiceDetailService from './serviceDetailsService'

import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'

describe('Alcohol Monitoring Service Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let alcoholMonitoringServiceDetailService: AlcoholMonitoringServiceDetailService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    alcoholMonitoringServiceDetailService = new AlcoholMonitoringServiceDetailService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as AlcoholMonitoringServiceDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Internal Server Error'))
    })
  })
})
