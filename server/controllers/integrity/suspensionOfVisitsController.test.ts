import { Request, Response } from 'express'
import AuditService from '../../services/auditService'
import IntegritySuspensionOfVisitsService from '../../services/integrity/suspensionOfVisitsService'
import SuspensionOfVisitsController from './suspensionOfVisitsController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { IntegritySuspensionOfVisitsEvent } from '../../models/integrity/suspensionOfVisits'
import SuspensionOfVisitsView, {
  IntegritySuspensionOfVisitsViewEvent,
  IntegritySuspensionOfVisitsViewModel,
} from '../../models/view-models/integrity/suspensionOfVisits'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/orderSummaryService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreSuspensionOfVisitsService = {
  getSuspensionOfVisits: jest.fn(),
} as unknown as IntegritySuspensionOfVisitsService

jest.spyOn(SuspensionOfVisitsView, 'construct')

describe('SuspensionOfVisitsController', () => {
  let controller: SuspensionOfVisitsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '1234321'

  const createEvent = (legacySubjectId: string, time: string, dateTime: string): IntegritySuspensionOfVisitsEvent => {
    return {
      legacySubjectId,
      suspensionOfVisits: 'Yes',
      requestedDate: dateTime,
      startDate: dateTime,
      startTime: time,
      endDate: dateTime,
    }
  }

  const createViewEvent = (dateTime: string, time: string): IntegritySuspensionOfVisitsViewEvent => {
    return {
      isoDateTime: dateTime,
      eventType: 'suspension-of-visits',
      suspensionOfVisits: 'Yes',
      requestedDate: dateTime,
      startDate: dateTime,
      startTime: time,
      endDate: dateTime,
    }
  }

  const createViewData = (
    legacySubjectId: string,
    events: IntegritySuspensionOfVisitsViewEvent[],
  ): IntegritySuspensionOfVisitsViewModel => {
    return {
      legacySubjectId,
      backUrl: `/integrity/${legacySubjectId}`,
      events,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new SuspensionOfVisitsController(auditService, emDatastoreSuspensionOfVisitsService)

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render the page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/integrity/${testOrderId}`,
      events: [] as IntegritySuspensionOfVisitsEvent[],
      legacySubjectId: testOrderId,
    }
    emDatastoreSuspensionOfVisitsService.getSuspensionOfVisits = jest.fn().mockResolvedValue([])

    await controller.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveBeenCalledWith(
      testOrderId,
      `/integrity/${testOrderId}`,
      expectedViewModel.events,
    )
    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/suspension-of-visits', expectedViewModel)
  })

  it('should render the page with suspension of visits events', async () => {
    const dateTime = '2001-02-03T01:23:45'
    const time = '10:20:30'

    const event = createEvent(testOrderId, time, dateTime)
    const viewEvent = createViewEvent(dateTime, time)
    const expectedViewData = createViewData(testOrderId, [viewEvent, viewEvent])

    emDatastoreSuspensionOfVisitsService.getSuspensionOfVisits = jest.fn().mockResolvedValue([event, event])

    await controller.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewData)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/suspension-of-visits', expectedViewData)
  })

  it('should order suspension of visits events by requestedDate', async () => {
    const firstDate = {
      time: '01:01:01',
      dateTime: '2001-01-01T01:01:01',
    }
    const secondDate = {
      ...firstDate,
      dateTime: '2002-02-02T02:02:02',
    }
    const thirdDate = {
      ...firstDate,
      dateTime: '2003-03-03T03:03:03',
    }

    const firstEvent = createEvent(testOrderId, firstDate.time, firstDate.dateTime)
    const secondEvent = createEvent(testOrderId, secondDate.time, secondDate.dateTime)
    const thirdEvent = createEvent(testOrderId, thirdDate.time, thirdDate.dateTime)

    emDatastoreSuspensionOfVisitsService.getSuspensionOfVisits = jest
      .fn()
      .mockResolvedValue([secondEvent, thirdEvent, firstEvent])

    const firstViewEvent = createViewEvent(firstDate.dateTime, firstDate.time)
    const secondViewEvent = createViewEvent(secondDate.dateTime, secondDate.time)
    const thirdViewEvent = createViewEvent(thirdDate.dateTime, thirdDate.time)

    const expectedViewData = createViewData(testOrderId, [firstViewEvent, secondViewEvent, thirdViewEvent])

    await controller.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsView.construct).toHaveReturnedWith(expectedViewData)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/suspension-of-visits', expectedViewData)
  })
})
