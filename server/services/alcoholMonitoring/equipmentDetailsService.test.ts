import nock from 'nock'
import AlcoholMonitoringEquipmentDetailsService from './equipmentDetailsService'

import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringEquipmentDetailsService: AlcoholMonitoringEquipmentDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(emDatastoreApiClient)
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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({ legacySubjectId })

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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as AlcoholMonitoringEquipmentDetails[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`).reply(401)

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Fake unexpected server error'))
    })
  })
})
