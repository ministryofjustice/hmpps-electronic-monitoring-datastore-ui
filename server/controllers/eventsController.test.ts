import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../services/auditService'
import EventsService from '../services/eventsService'
import EventsController from './eventsController'
// eslint-disable-next-line import/no-named-as-default
import EventsViewModel from '../models/view-models/events'
import { TimelineEventModel } from '../models/view-models/TimelineEvent'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { MonitoringEvent, MonitoringEventModel } from '../models/monitoringEvents'
import { IncidentEvent, IncidentEventModel } from '../models/incidentEvents'
import { ContactEvent, ContactEventModel } from '../models/contactEvents'
import { ViolationEvent } from '../models/violationEvents'

jest.mock('../services/eventsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const eventsService = new EventsService(null, null) as jest.Mocked<EventsService>

jest.spyOn(EventsViewModel, 'construct')

describe('EventsController', () => {
  let eventsController: EventsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 123456789

  beforeEach(() => {
    eventsController = new EventsController(auditService, eventsService)

    req = createMockRequest({
      session: {
        id: 'mock-session-id',
        cookie: { originalMaxAge: 3600000 } as session.Cookie,
        regenerate: jest.fn(),
        destroy: jest.fn(),
        reload: jest.fn(),
        save: jest.fn(),
        touch: jest.fn(),
        resetMaxAge: jest.fn(),
        returnTo: '/return',
        nowInMinutes: 12345,
        validationErrors: [],
        formData: {},
      } as session.Session & Partial<SessionData>,
      params: { orderId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      events: [] as (MonitoringEvent | IncidentEvent | ContactEvent | ViolationEvent)[],
      orderId: testOrderId,
    }

    eventsService.getEvents.mockResolvedValue([])

    await eventsController.showHistory(req, res, next)

    expect(EventsViewModel.construct).toHaveBeenCalledWith(testOrderId, [])
    expect(EventsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/event-history', expectedViewModel)
  })

  it('should render page with monitoring events', async () => {
    const eventType = 'TEST_EVENT'
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      events: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        } as TimelineEventModel,
      ],
      orderId: testOrderId,
    }

    eventsService.getEvents.mockResolvedValue([
      MonitoringEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await eventsController.showHistory(req, res, next)

    expect(EventsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/event-history', expectedViewModel)
  })

  it('should render page with incident events', async () => {
    const eventType = 'TEST_INCIDENT'
    const eventDateTime = '2023-03-03T03:03:03'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      events: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        } as TimelineEventModel,
      ],
      orderId: testOrderId,
    }

    eventsService.getEvents.mockResolvedValue([
      IncidentEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await eventsController.showHistory(req, res, next)

    expect(EventsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/event-history', expectedViewModel)
  })

  it('should render page with contact events', async () => {
    const eventType = 'TEST_PHONE_CALL'
    const eventDateTime = '2023-03-03T03:03:03'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      events: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType,
          properties: {},
        } as TimelineEventModel,
      ],
      orderId: testOrderId,
    }

    eventsService.getEvents.mockResolvedValue([
      ContactEventModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        type: eventType,
        dateTime: eventDateTime,
        details: {},
      }),
    ])

    await eventsController.showHistory(req, res, next)

    expect(EventsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/event-history', expectedViewModel)
  })
})
