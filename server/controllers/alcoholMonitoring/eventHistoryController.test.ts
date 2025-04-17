import { Request, Response } from 'express'
import { AuditService, AlcoholMonitoringEventHistoryService } from '../../services'
import AlcoholMonitoringEventHistoryController from './eventHistoryController'
// eslint-disable-next-line import/no-named-as-default
import AlcoholMonitoringEventHistoryViewModel from '../../models/view-models/alcoholMonitoring/eventHistory'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import {
  AlcoholMonitoringIncidentEvent,
  AlcoholMonitoringIncidentEventModel,
} from '../../models/alcoholMonitoring/incidentEvents'
import {
  AlcoholMonitoringContactEvent,
  AlcoholMonitoringContactEventModel,
} from '../../models/alcoholMonitoring/contactEvents'
import {
  AlcoholMonitoringViolationEvent,
  AlcoholMonitoringViolationEventModel,
} from '../../models/alcoholMonitoring/violationEvents'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/eventHistoryService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringEventHistoryService = {
  getEventHistory: jest.fn(),
} as unknown as AlcoholMonitoringEventHistoryService

jest.spyOn(AlcoholMonitoringEventHistoryViewModel, 'construct')

describe('AlcoholMonitoringEventHistoryController', () => {
  let alcoholMonitoringEventHistoryController: AlcoholMonitoringEventHistoryController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    alcoholMonitoringEventHistoryController = new AlcoholMonitoringEventHistoryController(
      auditService,
      alcoholMonitoringEventHistoryService,
    )

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      eventHistory: [] as (
        | AlcoholMonitoringIncidentEvent
        | AlcoholMonitoringContactEvent
        | AlcoholMonitoringViolationEvent
      )[],
    }

    alcoholMonitoringEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([])

    await alcoholMonitoringEventHistoryController.showEventHistory(req, res, next)

    expect(AlcoholMonitoringEventHistoryViewModel.construct).toHaveBeenCalledWith(
      testOrderId,
      `/alcohol-monitoring/${testOrderId}`,
      [],
    )
    expect(AlcoholMonitoringEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/event-history', expectedViewModel)
  })

  it('should render page with violation events', async () => {
    const eventType = 'TEST_EVENT'
    const eventDateTime = '2022-02-02T02:02:02'

    const details = {
      enforcementId: 'E001',
      nonComplianceReason: 'Test noncompliance reason',
      nonComplianceDateTime: eventDateTime,
      violationAlertId: 'V001',
      violationAlertDescription: 'Test alert description',
      violationEventNotificationDateTime: eventDateTime,
      actionTakenEms: 'Test action taken EMS',
      nonComplianceOutcome: 'Test outcome',
      nonComplianceResolved: 'Yes',
      dateResolved: eventDateTime,
      openClosed: 'Closed',
      visitRequired: 'No',
    }

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: details,
        },
      ],
    }

    alcoholMonitoringEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      AlcoholMonitoringViolationEventModel.parse({
        legacySubjectId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details,
      }),
    ])

    await alcoholMonitoringEventHistoryController.showEventHistory(req, res, next)

    expect(AlcoholMonitoringEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/event-history', expectedViewModel)
  })

  it('should render page with incident events', async () => {
    const eventType = 'TEST_INCIDENT'
    const eventDateTime = '2023-03-03T03:03:03'

    const details = {
      violationAlertId: 'V001',
      violationAlertDateTime: eventDateTime,
      violationAlertType: 'Test alert type',
      violationAlertResponseAction: 'Test response action',
      visitRequired: 'No',
      probationInteractionRequired: 'No',
      amsInteractionRequired: 'Yes',
      multipleAlerts: 'Yes',
      additionalAlerts: 'Test additional alerts',
    }

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: details,
        },
      ],
    }

    alcoholMonitoringEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      AlcoholMonitoringIncidentEventModel.parse({
        legacySubjectId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details,
      }),
    ])

    await alcoholMonitoringEventHistoryController.showEventHistory(req, res, next)

    expect(AlcoholMonitoringEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/event-history', expectedViewModel)
  })

  it('should render page with contact events', async () => {
    const eventType = 'TEST_PHONE_CALL'
    const eventDateTime = '2023-03-03T03:03:03'

    const details = {
      contactDateTime: eventDateTime,
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
    }

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: details,
        },
      ],
    }

    alcoholMonitoringEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      AlcoholMonitoringContactEventModel.parse({
        legacySubjectId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details,
      }),
    ])

    await alcoholMonitoringEventHistoryController.showEventHistory(req, res, next)

    expect(AlcoholMonitoringEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/event-history', expectedViewModel)
  })
})
