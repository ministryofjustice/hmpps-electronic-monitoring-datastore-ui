import { AlcoholMonitoringDatastoreClient } from '../../data'
import AlcoholMonitoringEquipmentDetailsService from './equipmentDetailsService'

import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

jest.mock('../../data')

describe('Alcohol Monitoring Equipment Details Service', () => {
  let alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient
  let alcoholMonitoringEquipmentDetailsService: AlcoholMonitoringEquipmentDetailsService

  beforeEach(() => {
    alcoholMonitoringDatastoreClient = {
      getEquipmentDetails: jest.fn(),
    } as unknown as jest.Mocked<AlcoholMonitoringDatastoreClient>
    alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(
      alcoholMonitoringDatastoreClient,
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
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

      alcoholMonitoringDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_003',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'legacy_subject_004',
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

      alcoholMonitoringDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_004',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      alcoholMonitoringDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue([])

      const result = await alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_006',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorization error', async () => {
      alcoholMonitoringDatastoreClient.getEquipmentDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_008',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      alcoholMonitoringDatastoreClient.getEquipmentDetails = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_009',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
