import { IntegrityDatastoreClient } from '../../data'
import IntegrityVisitDetailsService from './visitDetailsService'

import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'

jest.mock('../../data')

describe('Integrity visit details service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integrityVisitDetailsService: IntegrityVisitDetailsService

  beforeEach(() => {
    integrityDatastoreClient = {
      getVisitDetails: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integrityVisitDetailsService = new IntegrityVisitDetailsService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVisitDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          address: null,
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      integrityDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          address: null,
          actualWorkStartDateTime: '2020-03-03T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      integrityDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple visit details items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          address: null,
          actualWorkStartDateTime: '2020-04-04T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
        {
          legacySubjectId: '456',
          address: null,
          actualWorkStartDateTime: '2020-05-05T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
        {
          legacySubjectId: '789',
          address: null,
          actualWorkStartDateTime: '2020-06-06T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      integrityDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty list of visit details', async () => {
      const expectedResult = [] as IntegrityVisitDetails[]

      integrityDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.getVisitDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.getVisitDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
