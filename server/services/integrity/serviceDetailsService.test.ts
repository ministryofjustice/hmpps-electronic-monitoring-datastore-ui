import { IntegrityDatastoreClient } from '../../data'
import IntegrityServiceDetailsService from './serviceDetailsService'

import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

jest.mock('../../data')

describe('Integrity service details Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integrityServiceDetailsService: IntegrityServiceDetailsService

  beforeEach(() => {
    integrityDatastoreClient = {
      getServiceDetails: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integrityServiceDetailsService = new IntegrityServiceDetailsService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        } as IntegrityServiceDetails,
      ]

      integrityDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 0,
          serviceAddress1: '',
          serviceAddress2: '',
          serviceAddress3: '',
          serviceAddressPostCode: '',
          serviceStartDate: '',
          serviceEndDate: '',
          curfewStartDate: '',
          curfewEndDate: '',
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
      ]

      integrityDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 1,
          serviceAddress1: '',
          serviceAddress2: '',
          serviceAddress3: '',
          serviceAddressPostCode: '',
          serviceStartDate: '',
          serviceEndDate: '',
          curfewStartDate: '',
          curfewEndDate: '',
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: '456',
          serviceId: 2,
          serviceAddress1: '',
          serviceAddress2: '',
          serviceAddress3: '',
          serviceAddressPostCode: '',
          serviceStartDate: '',
          serviceEndDate: '',
          curfewStartDate: '',
          curfewEndDate: '',
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: '789',
          serviceId: 3,
          serviceAddress1: '',
          serviceAddress2: '',
          serviceAddress3: '',
          serviceAddressPostCode: '',
          serviceStartDate: '',
          serviceEndDate: '',
          curfewStartDate: '',
          curfewEndDate: '',
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
      ]

      integrityDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as IntegrityServiceDetails[]

      integrityDatastoreClient.getServiceDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.getServiceDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.getServiceDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
