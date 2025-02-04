import { Request, Response } from 'express'
import session, { SessionData } from 'express-session'
import { createDatastoreClient } from '../data/testUtils/mocks'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'
import SuspensionOfVisitsViewModel from '../models/view-models/suspensionOfVisits'
import { AuditService, SuspensionOfVisitsService } from '../services'
import SuspensionOfVisitsController from './suspensionOfVisitsController'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = { logPageView: jest.fn() } as unknown as AuditService
jest.mock('../services/suspensionOfVisitsService')
const suspensionOfVisitsService = new SuspensionOfVisitsService(null, null) as jest.Mocked<SuspensionOfVisitsService>
jest.spyOn(SuspensionOfVisitsViewModel, 'construct')

describe('SuspensionOfVisitsController', () => {
  let suspensionOfVisitsController: SuspensionOfVisitsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 1234321

  const createEvent = (orderId: number, dateTime: string) => {
    return {
      legacyOrderId: orderId,
      legacySubjectId: orderId,
      suspensionOfVisits: 'Yes',
      requestedDate: new Date(dateTime),
      startDate: dateTime,
      endDate: dateTime,
    }
  }

  const createEventView = (orderId: number, dateTime: string) => {
    return {
      isoDateTime: new Date(dateTime),
      dateTime: new Date(dateTime),
      date: new Date(dateTime).toDateString(),
      eventType: 'Suspension of visits',
      properties: createEvent(orderId, dateTime),
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    suspensionOfVisitsController = new SuspensionOfVisitsController(auditService, suspensionOfVisitsService)

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

  it('should render the page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}`,
      events: [] as SuspensionOfVisitsEvent[],
      orderId: testOrderId,
    }
    suspensionOfVisitsService.getSuspensionOfVisitsEvents.mockResolvedValue([])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsViewModel.construct).toHaveBeenCalledWith(testOrderId, expectedViewModel.events)
    expect(SuspensionOfVisitsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/suspension-of-visits', expectedViewModel)
  })

  it('should render the page with suspension of visits events', async () => {
    const dateTime = '2001-02-03T01:23:45'
    const backUrl = `/orders/${testOrderId}`

    const event = createEvent(testOrderId, dateTime)

    suspensionOfVisitsService.getSuspensionOfVisitsEvents.mockResolvedValue([event, event])

    const eventView = {
      isoDateTime: event.requestedDate,
      dateTime: event.requestedDate,
      date: event.requestedDate.toDateString(),
      eventType: 'Suspension of visits',
      properties: event,
    }

    const expectedResult = {
      orderId: testOrderId,
      backUrl,
      events: [eventView, eventView],
    }

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsViewModel.construct).toHaveReturnedWith(expectedResult)
    expect(res.render).toHaveBeenCalledWith('pages/order/suspension-of-visits', expectedResult)
  })

  it('should order suspension of visits events by requestedDate', async () => {
    const firstDate = '2001-01-01T01:01:01'
    const middleDate = '2002-02-02T02:02:02'
    const lastDate = '2003-03-03T03:03:03'
    const backUrl = `/orders/${testOrderId}`

    const firstEvent = createEvent(testOrderId, firstDate)
    const middleEvent = createEvent(testOrderId, middleDate)
    const lastEvent = createEvent(testOrderId, lastDate)

    const firstEventView = createEventView(testOrderId, firstDate)
    const middleEventView = createEventView(testOrderId, middleDate)
    const lastEventView = createEventView(testOrderId, lastDate)

    suspensionOfVisitsService.getSuspensionOfVisitsEvents.mockResolvedValue([middleEvent, lastEvent, firstEvent])

    const expectedResult = {
      orderId: testOrderId,
      backUrl,
      events: [firstEventView, middleEventView, lastEventView],
    }

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsViewModel.construct).toHaveReturnedWith(expectedResult)
    expect(res.render).toHaveBeenCalledWith('pages/order/suspension-of-visits', expectedResult)
  })
})
