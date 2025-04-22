import nock from 'nock'
import AlcoholMonitoringEventHistoryService from './eventHistoryService'

import { AlcoholMonitoringIncidentEvent } from '../../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringContactEvent } from '../../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringViolationEvent } from '../../models/alcoholMonitoring/violationEvents'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring event history Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringEventHistoryService: AlcoholMonitoringEventHistoryService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringEventHistoryService = new AlcoholMonitoringEventHistoryService(emDatastoreApiClient)
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

  describe('getEventHistory', () => {
    const legacySubjectId = '123'

    it('should fetch event history with one of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId,
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
          legacySubjectId,
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
          legacySubjectId,
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

      const expectedResult = [...contactEventsResponse, ...incidentEventsResponse, ...violationEventsResponse]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history with multiple of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId,
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
          legacySubjectId,
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
          legacySubjectId,
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
          legacySubjectId,
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
          legacySubjectId,
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
          legacySubjectId,
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

      const expectedResult = [...contactEventsResponse, ...incidentEventsResponse, ...violationEventsResponse]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history even if no events found', async () => {
      const incidentEventsResponse = [] as AlcoholMonitoringIncidentEvent[]
      const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      const expectedResult = [] as (
        | AlcoholMonitoringIncidentEvent
        | AlcoholMonitoringContactEvent
        | AlcoholMonitoringViolationEvent
      )[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      const result = await alcoholMonitoringEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorisation error getting incident events', async () => {
      const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(401)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of incident events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting incident events', async () => {
      const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`)
        .replyWithError('Fake unexpected server error')
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of incident events: Fake unexpected server error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      const incidentEventsResponse = [] as AlcoholMonitoringIncidentEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(401)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of contact events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      const incidentEventsResponse = [] as AlcoholMonitoringIncidentEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`)
        .replyWithError('Fake unexpected server error')

      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .reply(200, violationEventsResponse)

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of contact events: Fake unexpected server error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, violationEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`).reply(401)

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of violation events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
      const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`).reply(200, violationEventsResponse)
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)
        .replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of violation events: Fake unexpected server error'))
    })
  })
})
