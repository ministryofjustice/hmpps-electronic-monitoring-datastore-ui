import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityDatastoreClient from '../../data/integrityDatastoreClient'

import IntegrityEventHistoryService from '../../services/integrity/eventHistoryService'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/eventHistoryService')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
const integrityEventHistoryService = new IntegrityEventHistoryService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<IntegrityEventHistoryService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integrityEventHistoryService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity event history', () => {
  it(`creates an INTEGRITY_EVENT_HISTORY audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_EVENT_HISTORY, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests event history from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_002' }))
      .expect(_res => {
        expect(integrityEventHistoryService.getEventHistory).toHaveBeenCalledWith({
          legacySubjectId: 'event_history_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integrityEventHistoryService.getEventHistory = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays incident events in the event history from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([
      IntegrityIncidentEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_INCIDENT_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {},
      }),
    ] as (IntegrityMonitoringEvent | IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_004' }))
      .expect(res => {
        expect(res.text).toContain('TEST_INCIDENT_EVENT')
      })
  })

  it(`displays monitoring events in the event history from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([
      IntegrityMonitoringEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_MONITORING_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {},
      }),
    ] as (IntegrityMonitoringEvent | IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_005' }))
      .expect(res => {
        expect(res.text).toContain('TEST_MONITORING_EVENT')
      })
  })

  it(`displays violation events in the event history from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([
      IntegrityViolationEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_VIOLATION_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {},
      }),
    ] as (IntegrityMonitoringEvent | IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_006' }))
      .expect(res => {
        expect(res.text).toContain('TEST_VIOLATION_EVENT')
      })
  })

  it(`displays contact events in the event history from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([
      IntegrityContactEvent.parse({
        legacySubjectId: 'event_history_004',
        type: 'TEST_CONTACT_EVENT',
        dateTime: '2022-02-02T02:02:02',
        details: {},
      }),
    ] as (IntegrityMonitoringEvent | IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent)[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_007' }))
      .expect(res => {
        expect(res.text).toContain('TEST_CONTACT_EVENT')
      })
  })

  it(`displays message when no event history is returned from the integrity event history service`, async () => {
    integrityEventHistoryService.getEventHistory.mockResolvedValue([] as IntegrityMonitoringEvent[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EVENT_HISTORY, { legacySubjectId: 'event_history_008' }))
      .expect(res => {
        expect(res.text).toContain('No events found')
      })
  })
})
