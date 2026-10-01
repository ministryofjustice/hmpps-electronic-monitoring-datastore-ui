import { AlcoholMonitoringDatastoreClient } from '../../data'
import AlcoholMonitoringServiceDetailsService from './serviceDetailsService'

import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

jest.mock('../../data')

describe('Alcohol Monitoring service details service', () => {
  let alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient
  let alcoholMonitoringServiceDetailService: AlcoholMonitoringServiceDetailsService

  beforeEach(() => {
    alcoholMonitoringDatastoreClient = {
      getServiceDetails: jest.fn(),
    } as unknown as jest.Mocked<AlcoholMonitoringDatastoreClient>
    alcoholMonitoringServiceDetailService = new AlcoholMonitoringServiceDetailsService(alcoholMonitoringDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'legacy_subject_021',
          serviceStartDate: '',
          serviceEndDate: '',
          serviceAddress: '',
          equipmentStartDate: '',
          equipmentEndDate: '',
          hmuSerialNumber: '',
          deviceSerialNumber: '',
        } as AlcoholMonitoringServiceDetails,
      ]

      alcoholMonitoringDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_021',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'legacy_subject_022',
          serviceStartDate: '',
          serviceEndDate: '',
          serviceAddress: '',
          equipmentStartDate: '',
          equipmentEndDate: '',
          hmuSerialNumber: '',
          deviceSerialNumber: '',
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: 'legacy_subject_022',
          serviceStartDate: '',
          serviceEndDate: '',
          serviceAddress: '',
          equipmentStartDate: '',
          equipmentEndDate: '',
          hmuSerialNumber: '',
          deviceSerialNumber: '',
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: 'legacy_subject_022',
          serviceStartDate: '',
          serviceEndDate: '',
          serviceAddress: '',
          equipmentStartDate: '',
          equipmentEndDate: '',
          hmuSerialNumber: '',
          deviceSerialNumber: '',
        } as AlcoholMonitoringServiceDetails,
      ]

      alcoholMonitoringDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_022',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as AlcoholMonitoringServiceDetails[]

      alcoholMonitoringDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringServiceDetailService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_023',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      alcoholMonitoringDatastoreClient.getServiceDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_024',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      alcoholMonitoringDatastoreClient.getServiceDetails = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringServiceDetailService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_025',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
