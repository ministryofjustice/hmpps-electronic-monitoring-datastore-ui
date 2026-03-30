import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'

import AlcoholMonitoringEquipmentDetailsService from './equipmentDetailsService'
import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>
  let alcoholMonitoringEquipmentDetailsService: AlcoholMonitoringEquipmentDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
    // nock.abortPendingRequests()
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of equipment details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
        {
          legacySubjectId: '456',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
        {
          legacySubjectId: '789',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as AlcoholMonitoringEquipmentDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Internal Server Error'))
    })
  })
})
