import { IntegrityDatastoreClient } from '../../data'
import IntegritySuspensionOfVisitsService from './suspensionOfVisitsService'

import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

jest.mock('../../data')

describe('Integrity Suspension of visits Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integritySuspensionOfVisitsService: IntegritySuspensionOfVisitsService

  beforeEach(() => {
    integrityDatastoreClient = {
      getSuspensionOfVisits: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integritySuspensionOfVisitsService = new IntegritySuspensionOfVisitsService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getSuspensionOfVisits', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one suspension of visits item', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'legacy_subject_001',
          suspensionOfVisits: 'yes',
          requestedDate: '',
          startDate: '',
          startTime: '',
          endDate: '',
        } as IntegritySuspensionOfVisits,
      ]

      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockResolvedValue(expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one suspension of visits item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'no',
          requestedDate: '',
          startDate: '',
          startTime: '',
          endDate: '',
        } as IntegritySuspensionOfVisits,
      ]

      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockResolvedValue(expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple suspension of visits items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'yes',
          requestedDate: '',
          startDate: '',
          startTime: '',
          endDate: '',
        } as IntegritySuspensionOfVisits,
        {
          legacySubjectId: '456',
          suspensionOfVisits: 'no',
          requestedDate: '',
          startDate: '',
          startTime: '',
          endDate: '',
        } as IntegritySuspensionOfVisits,
        {
          legacySubjectId: '789',
          suspensionOfVisits: 'yes',
          requestedDate: '',
          startDate: '',
          startTime: '',
          endDate: '',
        } as IntegritySuspensionOfVisits,
      ]

      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockResolvedValue(expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of suspension of visits items', async () => {
      const expectedResult = [] as IntegritySuspensionOfVisits[]

      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockResolvedValue(expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.getSuspensionOfVisits = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
