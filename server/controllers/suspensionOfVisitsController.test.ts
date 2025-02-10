import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../services/auditService'
import SuspensionOfVisitsService from '../services/suspensionOfVisitsService'
import SuspensionOfVisitsController from './suspensionOfVisitsController'
// eslint-disable-next-line import/no-named-as-default
import SuspensionOfVisitsViewModel from '../models/view-models/suspensionOfVisits'
import { TimelineEventModel } from '../models/view-models/TimelineEvent'
import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import { SuspensionOfVisits, SuspensionOfVisitsModel } from '../models/suspensionOfVisits'

jest.mock('../services/SuspensionOfVisitsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const suspensionOfVisitsService = new SuspensionOfVisitsService(null, null) as jest.Mocked<SuspensionOfVisitsService>

jest.spyOn(SuspensionOfVisitsViewModel, 'construct')

describe('SuspensionOfVisitsController', () => {
  let suspensionOfVisitsController: SuspensionOfVisitsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 123456789

  beforeEach(() => {
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

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      suspensionOfVisits: [] as SuspensionOfVisits[],
      orderId: testOrderId,
    }

    suspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsViewModel.construct).toHaveBeenCalledWith(testOrderId, [])
    expect(SuspensionOfVisitsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/suspension-of-visits', expectedViewModel)
  })

  it('should render page with suspension of visits', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      suspensionOfVisits: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'suspension-of-visits',
          properties: {
            legacySubjectId: testOrderId,
            suspensionOfVisits: 'Yes',
            suspensionOfVisitsRequestedDate: eventDateTime,
            suspensionOfVisitsStartDate: eventDateTime,
            suspensionOfVisitsEndDate: eventDateTime,
          },
        } as TimelineEventModel,
      ],
      orderId: testOrderId,
    }

    suspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([
      SuspensionOfVisitsModel.parse({
        legacySubjectId: testOrderId,
        suspensionOfVisits: 'Yes',
        suspensionOfVisitsRequestedDate: eventDateTime,
        suspensionOfVisitsStartDate: eventDateTime,
        suspensionOfVisitsEndDate: eventDateTime,
      }),
    ])

    await suspensionOfVisitsController.showSuspensionOfVisits(req, res, next)

    expect(SuspensionOfVisitsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/suspension-of-visits', expectedViewModel)
  })
})
