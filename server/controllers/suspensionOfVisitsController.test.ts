import { Request, Response } from 'express'
import session, { SessionData } from 'express-session'
import { createDatastoreClient } from '../data/testUtils/mocks'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'
import SuspensionOfVisitsView, {
  SuspensionOfVisitsViewEvent,
  SuspensionOfVisitsViewModel,
} from '../models/view-models/suspensionOfVisits'
import { AuditService, SuspensionOfVisitsService } from '../services'
import SuspensionOfVisitsController from './suspensionOfVisitsController'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'

const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = { logPageView: jest.fn() } as unknown as AuditService
jest.mock('../services/suspensionOfVisitsService')
const suspensionOfVisitsService = new SuspensionOfVisitsService(null, null) as jest.Mocked<SuspensionOfVisitsService>
jest.spyOn(SuspensionOfVisitsView, 'construct')

describe('SuspensionOfVisitsController', () => {
  let suspensionOfVisitsController: SuspensionOfVisitsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 1234321

  const createEvent = (orderId: number, time: string, dateTime: string): SuspensionOfVisitsEvent => {
    return {
      legacySubjectId: orderId,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: dateTime,
      suspensionOfVisitsStartDate: dateTime,
      suspensionOfVisitsStartTime: time,
      suspensionOfVisitsEndDate: dateTime,
    }
  }

  const createViewEvent = (viewDate: string, viewTime: string, timestamp: string): SuspensionOfVisitsViewEvent => {
    return {
      timestamp,
      suspensionOfVisits: 'Yes',
      requestedDate: viewDate,
      startDate: viewDate,
      startTime: viewTime,
      endDate: viewDate,
    }
  }

  const createViewData = (orderId: number, events: SuspensionOfVisitsViewEvent[]): SuspensionOfVisitsViewModel => {
    return {
      orderId,
      backUrl: `/orders/${orderId}`,
      events,
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
    suspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveBeenCalledWith(testOrderId, expectedViewModel.events)
    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/suspensionOfVisits', expectedViewModel)
  })

  it('should render the page with suspension of visits events', async () => {
    const dateTime = '2001-02-03T01:23:45'
    const time = '10:20:30'
    const viewDate = '03/02/2001'
    const viewTime = '1020'

    const event = createEvent(testOrderId, time, dateTime)
    const viewEvent = createViewEvent(viewDate, viewTime, dateTime)
    const expectedViewData = createViewData(testOrderId, [viewEvent, viewEvent])

    suspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([event, event])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewData)
    expect(res.render).toHaveBeenCalledWith('pages/suspensionOfVisits', expectedViewData)
  })

  it('should order suspension of visits events by requestedDate', async () => {
    const firstDate = {
      time: '01:01:01',
      dateTime: '2001-01-01T01:01:01',
      viewTime: '0101',
      viewDate: '01/01/2001',
    }
    const secondDate = {
      ...firstDate,
      dateTime: '2002-02-02T02:02:02',
      viewDate: '02/02/2002',
    }
    const thirdDate = {
      ...firstDate,
      dateTime: '2003-03-03T03:03:03',
      viewDate: '03/03/2003',
    }

    const firstEvent = createEvent(testOrderId, firstDate.time, firstDate.dateTime)
    const secondEvent = createEvent(testOrderId, secondDate.time, secondDate.dateTime)
    const thirdEvent = createEvent(testOrderId, thirdDate.time, thirdDate.dateTime)

    suspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([secondEvent, thirdEvent, firstEvent])

    const firstViewEvent = createViewEvent(firstDate.viewDate, firstDate.viewTime, firstDate.dateTime)
    const secondViewEvent = createViewEvent(secondDate.viewDate, secondDate.viewTime, secondDate.dateTime)
    const thirdViewEvent = createViewEvent(thirdDate.viewDate, thirdDate.viewTime, thirdDate.dateTime)

    const expectedViewData = createViewData(testOrderId, [firstViewEvent, secondViewEvent, thirdViewEvent])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewData)
    expect(res.render).toHaveBeenCalledWith('pages/suspensionOfVisits', expectedViewData)
  })
})
