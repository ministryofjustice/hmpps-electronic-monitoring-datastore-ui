import { IntegrityDatastoreClient } from '../../data'
import IntegrityEventHistoryService from './eventHistoryService'

import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'

jest.mock('../../data')

describe('Integrity event history Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integrityEventHistoryService: IntegrityEventHistoryService

  beforeEach(() => {
    integrityDatastoreClient = {
      getMonitoringEvents: jest.fn(),
      getIncidentEvents: jest.fn(),
      getContactEvents: jest.fn(),
      getViolationEvents: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integrityEventHistoryService = new IntegrityEventHistoryService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEventHistory', () => {
    it('should fetch event history with one of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'contact',
          dateTime: '2002-02-02T02:02:02',
          details: {
            outcome: null,
            type: 'contact',
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        } as IntegrityContactEvent,
      ]
      const incidentEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            type: 'foo',
          },
        } as IntegrityIncidentEvent,
      ]
      const violationEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementReason: null,
            investigationOutcomeReason: null,
            breachDetails: null,
            breachEnforcementOutcome: null,
            agencyAction: null,
            breachDateTime: null,
            breachIdentifiedDateTime: null,
            authorityFirstNotifiedDateTime: null,
            agencyResponseDate: null,
            breachPackRequestedDate: null,
            breachPackSentDate: null,
            section9Date: null,
            hearingDate: null,
            summonsServedDate: null,
            subjectLetterSentDate: null,
            warningLetterSentDateTime: null,
          },
        } as IntegrityViolationEvent,
      ]
      const monitoringEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'monitoring',
          dateTime: '2005-05-05T05:05:05',
          details: {
            type: 'bar',
            processedDateTime: null,
          },
        } as IntegrityMonitoringEvent,
      ]

      const expectedResult = [
        ...monitoringEventsResponse,
        ...incidentEventsResponse,
        ...contactEventsResponse,
        ...violationEventsResponse,
      ]

      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue(monitoringEventsResponse)
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue(incidentEventsResponse)
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue(contactEventsResponse)
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue(violationEventsResponse)

      const result = await integrityEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_004',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history with multiple of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'contact',
          dateTime: '2002-02-02T02:02:02',
          details: {
            outcome: null,
            type: 'baz',
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        } as IntegrityContactEvent,
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'contact',
          dateTime: '2005-05-05T05:05:05',
          details: {
            outcome: null,
            type: 'nan',
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        } as IntegrityContactEvent,
      ]
      const incidentEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            type: 'yellow',
          },
        } as IntegrityIncidentEvent,
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'incident',
          dateTime: '2006-06-06T06:06:06',
          details: {
            type: 'red alert',
          },
        } as IntegrityIncidentEvent,
      ]
      const violationEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementReason: null,
            investigationOutcomeReason: null,
            breachDetails: null,
            breachEnforcementOutcome: null,
            agencyAction: null,
            breachDateTime: null,
            breachIdentifiedDateTime: null,
            authorityFirstNotifiedDateTime: null,
            agencyResponseDate: null,
            breachPackRequestedDate: null,
            breachPackSentDate: null,
            section9Date: null,
            hearingDate: null,
            summonsServedDate: null,
            subjectLetterSentDate: null,
            warningLetterSentDateTime: null,
          },
        } as IntegrityViolationEvent,
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'violation',
          dateTime: '2007-07-07T07:07:07',
          details: {
            enforcementReason: null,
            investigationOutcomeReason: null,
            breachDetails: null,
            breachEnforcementOutcome: null,
            agencyAction: null,
            breachDateTime: null,
            breachIdentifiedDateTime: null,
            authorityFirstNotifiedDateTime: null,
            agencyResponseDate: null,
            breachPackRequestedDate: null,
            breachPackSentDate: null,
            section9Date: null,
            hearingDate: null,
            summonsServedDate: null,
            subjectLetterSentDate: null,
            warningLetterSentDateTime: null,
          },
        } as IntegrityViolationEvent,
      ]
      const monitoringEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'monitoring',
          dateTime: '2008-08-08T08:08:08',
          details: {
            type: 'bar',
          },
        } as IntegrityMonitoringEvent,
        {
          legacySubjectId: 'legacy_subject_004',
          type: 'monitoring',
          dateTime: '2009-09-09T09:09:09',
          details: {
            type: 'foo',
          },
        } as IntegrityMonitoringEvent,
      ]

      const expectedResult = [
        ...monitoringEventsResponse,
        ...incidentEventsResponse,
        ...contactEventsResponse,
        ...violationEventsResponse,
      ]

      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue(monitoringEventsResponse)
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue(incidentEventsResponse)
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue(contactEventsResponse)
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue(violationEventsResponse)

      const result = await integrityEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_003',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history even if no events found', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      const result = await integrityEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_002',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorisation error getting monitoring events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_006',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting monitoring events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockRejectedValue(new Error('Internal Server Error'))
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_007',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('should propagate an error if there is an authorisation error getting incident events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_008',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting incident events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockRejectedValue(new Error('Internal Server Error'))
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_009',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_010',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockRejectedValue(new Error('Internal Server Error'))
      integrityDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_011',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('should propagate an error if there is an authorisation error getting violation events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_012',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting violation events', async () => {
      integrityDatastoreClient.getMonitoringEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      integrityDatastoreClient.getViolationEvents = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integrityEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_013',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
