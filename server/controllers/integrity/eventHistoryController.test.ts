import { Request, Response } from 'express'
import AuditService from '../../services/auditService'
import IntegrityEventHistoryService from '../../services/integrity/eventHistoryService'
import IntegrityEventHistoryController from './eventHistoryController'
// eslint-disable-next-line import/no-named-as-default
import IntegrityEventHistoryViewModel from '../../models/view-models/integrity/eventHistory'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { IntegrityMonitoringEvent, IntegrityMonitoringEventModel } from '../../models/integrity/monitoringEvents'
import { IntegrityIncidentEvent, IntegrityIncidentEventModel } from '../../models/integrity/incidentEvents'
import { IntegrityContactEvent, IntegrityContactEventModel } from '../../models/integrity/contactEvents'
import { IntegrityViolationEvent, IntegrityViolationEventModel } from '../../models/integrity/violationEvents'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/eventHistoryService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityEventHistoryService = { getEventHistory: jest.fn() } as unknown as IntegrityEventHistoryService

jest.spyOn(IntegrityEventHistoryViewModel, 'construct')

describe('IntegrityEventHistoryController', () => {
  let integrityEventHistoryController: IntegrityEventHistoryController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 123456789

  beforeEach(() => {
    integrityEventHistoryController = new IntegrityEventHistoryController(auditService, integrityEventHistoryService)

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      eventHistory: [] as (
        | IntegrityMonitoringEvent
        | IntegrityIncidentEvent
        | IntegrityContactEvent
        | IntegrityViolationEvent
      )[],
    }

    integrityEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([])

    await integrityEventHistoryController.showEventHistory(req, res, next)

    expect(IntegrityEventHistoryViewModel.construct).toHaveBeenCalledWith(testOrderId, `/integrity/${testOrderId}`, [])
    expect(IntegrityEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/event-history', expectedViewModel)
  })

  it('should render page with monitoring events', async () => {
    const eventType = 'TEST_EVENT'
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        },
      ],
    }

    integrityEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      IntegrityMonitoringEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await integrityEventHistoryController.showEventHistory(req, res, next)

    expect(IntegrityEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/event-history', expectedViewModel)
  })

  it('should render page with violation events', async () => {
    const eventType = 'TEST_INCIDENT'
    const eventDateTime = '2023-03-03T03:03:03'

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        },
      ],
    }

    integrityEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      IntegrityViolationEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await integrityEventHistoryController.showEventHistory(req, res, next)

    expect(IntegrityEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/event-history', expectedViewModel)
  })

  it('should render page with incident events', async () => {
    const eventType = 'TEST_INCIDENT'
    const eventDateTime = '2023-03-03T03:03:03'

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        },
      ],
    }

    integrityEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      IntegrityIncidentEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await integrityEventHistoryController.showEventHistory(req, res, next)

    expect(IntegrityEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/event-history', expectedViewModel)
  })

  it('should render page with contact events', async () => {
    const eventType = 'TEST_PHONE_CALL'
    const eventDateTime = '2023-03-03T03:03:03'

    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      eventHistory: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {
            outcome: 'outcome',
            type: eventType,
            reason: 'reason',
            channel: 'channel',
            userId: 'user-id',
            userName: 'username',
            modifiedDateTime: eventDateTime,
          },
        },
      ],
    }

    integrityEventHistoryService.getEventHistory = jest.fn().mockResolvedValue([
      IntegrityContactEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {
          outcome: 'outcome',
          type: eventType,
          reason: 'reason',
          channel: 'channel',
          userId: 'user-id',
          userName: 'username',
          modifiedDateTime: eventDateTime,
        },
      }),
    ])

    await integrityEventHistoryController.showEventHistory(req, res, next)

    expect(IntegrityEventHistoryViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/event-history', expectedViewModel)
  })
})
