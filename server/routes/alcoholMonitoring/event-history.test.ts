import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import AlcoholMonitoringDatastoreClient from '../../data/alcoholMonitoringDatastoreClient'

import AlcoholMonitoringEventHistoryService from '../../services/alcoholMonitoring/eventHistoryService'
import { AlcoholMonitoringContactEvent } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../data/models/alcoholMonitoringViolationEvent'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/alcoholMonitoring/eventHistoryService')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
const alcoholMonitoringEventHistoryService = new AlcoholMonitoringEventHistoryService(
  {} as AlcoholMonitoringDatastoreClient,
) as jest.Mocked<AlcoholMonitoringEventHistoryService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      alcoholMonitoringEventHistoryService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('AlcoholMonitoring event history', () => {
  it(`creates an ALCOHOL_MONITORING_EVENT_HISTORY audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_EVENT_HISTORY, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests event history from the alcoholMonitoring event history service`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory.mockResolvedValue([])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_002' }))
      .expect(_res => {
        expect(alcoholMonitoringEventHistoryService.getEventHistory).toHaveBeenCalledWith({
          legacySubjectId: 'event_history_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays incident events in the event history from the alcoholMonitoring event history service`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory.mockResolvedValue([
      AlcoholMonitoringIncidentEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_INCIDENT_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {
          violationAlertId: 'V001',
          violationAlertDateTime: '2022-02-02T02:02:02',
          violationAlertType: 'Test alert type',
          violationAlertResponseAction: 'Test response action',
          visitRequired: 'No',
          probationInteractionRequired: 'No',
          amsInteractionRequired: 'Yes',
          multipleAlerts: 'Yes',
          additionalAlerts: 'Test additional alerts',
        },
      }),
    ] as (AlcoholMonitoringIncidentEvent | AlcoholMonitoringContactEvent | AlcoholMonitoringViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_004' }))
      .expect(res => {
        expect(res.text).toContain('TEST_INCIDENT_EVENT')
      })
  })

  it(`displays violation events in the event history from the alcoholMonitoring event history service`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory.mockResolvedValue([
      AlcoholMonitoringViolationEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_VIOLATION_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {
          enforcementId: 'E001',
          nonComplianceReason: 'Test noncompliance reason',
          nonComplianceDateTime: '2022-02-02T02:02:02',
          violationAlertId: 'V001',
          violationAlertDescription: 'Test alert description',
          violationEventNotificationDateTime: '2022-02-02T02:02:02',
          actionTakenEms: 'Test action taken EMS',
          nonComplianceOutcome: 'Test outcome',
          nonComplianceResolved: 'Yes',
          dateResolved: '2022-02-02T02:02:02',
          openClosed: 'Closed',
          visitRequired: 'No',
        },
      }),
    ] as (AlcoholMonitoringIncidentEvent | AlcoholMonitoringContactEvent | AlcoholMonitoringViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_006' }))
      .expect(res => {
        expect(res.text).toContain('TEST_VIOLATION_EVENT')
      })
  })

  it(`displays contact events in the event history from the alcoholMonitoring event history service`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory.mockResolvedValue([
      AlcoholMonitoringContactEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_CONTACT_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {
          contactDateTime: '2023-03-03T03:03:03',
          inboundOrOutbound: 'Inbound',
          fromTo: 'From',
          channel: 'Probation',
          subjectConsentWithdrawn: 'No',
          callOutcome: 'Test call outcome',
          statement: 'Test statement',
          reasonForContact: 'Test contact reason',
          outcomeOfContact: 'Test contact outcome',
          visitRequired: 'No ',
          visitId: 'V001',
        },
      }),
    ] as (AlcoholMonitoringIncidentEvent | AlcoholMonitoringContactEvent | AlcoholMonitoringViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_007' }))
      .expect(res => {
        expect(res.text).toContain('TEST_CONTACT_EVENT')
      })
  })

  it(`displays message when no event history is returned from the alcoholMonitoring event history service`, async () => {
    alcoholMonitoringEventHistoryService.getEventHistory.mockResolvedValue(
      [] as (AlcoholMonitoringIncidentEvent | AlcoholMonitoringContactEvent | AlcoholMonitoringViolationEvent)[],
    )

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EVENT_HISTORY, { legacySubjectId: 'event_history_008' }))
      .expect(res => {
        expect(res.text).toContain('No events found')
      })
  })
})
