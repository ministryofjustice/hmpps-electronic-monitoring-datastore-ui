import { AlcoholMonitoringDatastoreClient } from '../../data'
import AlcoholMonitoringEventHistoryService from './eventHistoryService'

import { AlcoholMonitoringContactEvent } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../data/models/alcoholMonitoringViolationEvent'

jest.mock('../../data')

describe('Alcohol Monitoring event history service', () => {
  let alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient
  let alcoholMonitoringEventHistoryService: AlcoholMonitoringEventHistoryService

  beforeEach(() => {
    alcoholMonitoringDatastoreClient = {
      getEquipmentDetails: jest.fn(),
    } as unknown as jest.Mocked<AlcoholMonitoringDatastoreClient>
    alcoholMonitoringEventHistoryService = new AlcoholMonitoringEventHistoryService(alcoholMonitoringDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEventHistory', () => {
    it('should fetch event history with one of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_001',
          type: 'contact',
          dateTime: '2002-02-02T02:02:02',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        },
      ] as AlcoholMonitoringContactEvent[]
      const incidentEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_001',
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        },
      ] as AlcoholMonitoringIncidentEvent[]
      const violationEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_001',
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        },
      ] as AlcoholMonitoringViolationEvent[]

      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue(contactEventsResponse)
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue(incidentEventsResponse)
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue(violationEventsResponse)

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_001',
      })

      expect(result).toEqual([...contactEventsResponse, ...incidentEventsResponse, ...violationEventsResponse])
    })

    it('should fetch event history with multiple of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_002',
          type: 'contact',
          dateTime: '2002-02-02T02:02:02',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        },

        {
          legacySubjectId: 'legacy_subject_002',
          type: 'contact',
          dateTime: '2005-05-05T05:05:05',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        },
      ] as AlcoholMonitoringContactEvent[]
      const incidentEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_002',
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        },
        {
          legacySubjectId: 'legacy_subject_002',
          type: 'incident',
          dateTime: '2006-06-06T06:06:06',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        },
      ] as AlcoholMonitoringIncidentEvent[]
      const violationEventsResponse = [
        {
          legacySubjectId: 'legacy_subject_002',
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        },
        {
          legacySubjectId: 'legacy_subject_002',
          type: 'violation',
          dateTime: '2007-07-07T07:07:07',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        },
      ] as AlcoholMonitoringViolationEvent[]

      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue(contactEventsResponse)
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue(incidentEventsResponse)
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue(violationEventsResponse)

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_002',
      })

      expect(result).toEqual([...contactEventsResponse, ...incidentEventsResponse, ...violationEventsResponse])
    })

    it('should fetch event history even if no events found', async () => {
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({
        userToken: 'test-system-token',
        legacySubjectId: 'legacy_subject_003',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorisation error getting incident events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_004',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting incident events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_005',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_006',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getContactEvents = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockResolvedValue([])

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_007',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('should propagate an error if there is an authorisation error getting violation events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getViolationEvents = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_008',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error getting violation events', async () => {
      alcoholMonitoringDatastoreClient.getIncidentEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getContactEvents = jest.fn().mockResolvedValue([])
      alcoholMonitoringDatastoreClient.getViolationEvents = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          userToken: 'test-system-token',
          legacySubjectId: 'legacy_subject_009',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
