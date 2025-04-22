import nock from 'nock'
import IntegrityEventHistoryService from './eventHistoryService'

import { IntegrityIncidentEvent } from '../../models/integrity/incidentEvents'
import { IntegrityContactEvent } from '../../models/integrity/contactEvents'
import { IntegrityViolationEvent } from '../../models/integrity/violationEvents'
import { IntegrityMonitoringEvent } from '../../models/integrity/monitoringEvents'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring event history Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityEventHistoryService: IntegrityEventHistoryService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityEventHistoryService = new IntegrityEventHistoryService(emDatastoreApiClient)
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
            outcome: null,
            type: null,
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        },
      ] as IntegrityContactEvent[]
      const incidentEventsResponse = [
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            type: null,
          },
        },
      ] as IntegrityIncidentEvent[]
      const violationEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            type: null,
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
        },
      ] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [
        {
          legacySubjectId,
          type: 'montoring',
          dateTime: '2005-05-05T05:05:05',
          details: {
            type: null,
            processedDateTime: null,
          },
        },
      ] as IntegrityMonitoringEvent[]

      const expectedResult = [
        ...monitoringEventsResponse,
        ...incidentEventsResponse,
        ...contactEventsResponse,
        ...violationEventsResponse,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      const result = await integrityEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history with multiple of each event type', async () => {
      const contactEventsResponse = [
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2002-02-02T02:02:02',
          details: {
            outcome: null,
            type: null,
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        },
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2005-05-05T05:05:05',
          details: {
            outcome: null,
            type: null,
            reason: null,
            channel: null,
            userId: null,
            userName: null,
            modifiedDateTime: null,
          },
        },
      ] as IntegrityContactEvent[]
      const incidentEventsResponse = [
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            type: null,
          },
        },
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2006-06-06T06:06:06',
          details: {
            type: null,
          },
        },
      ] as IntegrityIncidentEvent[]
      const violationEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            type: null,
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
        },
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2007-07-07T07:07:07',
          details: {
            type: null,
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
        },
      ] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [
        {
          legacySubjectId,
          type: 'montoring',
          dateTime: '2008-08-08T08:08:08',
          details: {
            type: null,
          },
        },
        {
          legacySubjectId,
          type: 'montoring',
          dateTime: '2009-09-09T09:09:09',
          details: {
            type: null,
          },
        },
      ] as IntegrityMonitoringEvent[]

      const expectedResult = [
        ...monitoringEventsResponse,
        ...incidentEventsResponse,
        ...contactEventsResponse,
        ...violationEventsResponse,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      const result = await integrityEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch event history even if no events found', async () => {
      const incidentEventsResponse = [] as IntegrityIncidentEvent[]
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      const expectedResult = [] as (IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent)[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      const result = await integrityEventHistoryService.getEventHistory({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorisation error getting monitoring events', async () => {
      const incidentEventsResponse = [] as IntegrityIncidentEvent[]
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(401)

      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of monitoring events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting monitoring events', async () => {
      const incidentEventsResponse = [] as IntegrityIncidentEvent[]
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]

      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/monitoring-events`)
        .replyWithError('Fake unexpected server error')
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of monitoring events: Fake unexpected server error'))
    })

    it('should propagate an error if there is an authorisation error getting incident events', async () => {
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(401)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of incident events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting incident events', async () => {
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/incident-events`)
        .replyWithError('Fake unexpected server error')
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of incident events: Fake unexpected server error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      const incidentEventsResponse = [] as IntegrityIncidentEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(401)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of contact events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      const incidentEventsResponse = [] as IntegrityIncidentEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, incidentEventsResponse)
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/contact-events`)
        .replyWithError('Fake unexpected server error')

      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(200, violationEventsResponse)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of contact events: Fake unexpected server error'))
    })

    it('should propagate an error if there is an authorisation error getting contact events', async () => {
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, violationEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/violation-events`).reply(401)

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of violation events: Unauthorized'))
    })

    it('should propagate an error if there is a server error getting contact events', async () => {
      const contactEventsResponse = [] as IntegrityContactEvent[]
      const violationEventsResponse = [] as IntegrityViolationEvent[]
      const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/monitoring-events`).reply(200, monitoringEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/incident-events`).reply(200, contactEventsResponse)
      fakeClient.get(`/orders/integrity/${legacySubjectId}/contact-events`).reply(200, violationEventsResponse)
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/violation-events`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integrityEventHistoryService.getEventHistory({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of violation events: Fake unexpected server error'))
    })
  })
})
