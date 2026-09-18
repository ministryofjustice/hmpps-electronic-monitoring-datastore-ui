import { AlcoholMonitoringDatastoreClient } from '../../data'
import AlcoholMonitoringVisitDetailsService from './visitDetailsService'

import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'

jest.mock('../../data')

describe('Alcohol Monitoring visit details service', () => {
  let alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient
  let alcoholMonitoringVisitDetailsService: AlcoholMonitoringVisitDetailsService

  beforeEach(() => {
    alcoholMonitoringDatastoreClient = {
      getVisitDetails: jest.fn(),
    } as unknown as jest.Mocked<AlcoholMonitoringDatastoreClient>
    alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(alcoholMonitoringDatastoreClient)
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
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_100',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_101',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple visit detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'legacy_subject_102',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '456',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '789',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]
      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_102',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockResolvedValue([])

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_103',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorization error', async () => {
      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_104',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      alcoholMonitoringDatastoreClient.getVisitDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
