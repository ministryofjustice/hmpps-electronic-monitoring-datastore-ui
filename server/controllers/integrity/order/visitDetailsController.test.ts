import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../../../services/auditService'
import EmDatastoreVisitDetailsService from '../../../services/emDatastoreVisitDetailsService'
import VisitDetailsController from './visitDetailsController'
// eslint-disable-next-line import/no-named-as-default
import VisitDetailsViewModel from '../../../models/view-models/visitDetails'
import { TimelineEventModel } from '../../../models/view-models/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../../testutils/mocks/mockExpress'
import { VisitDetails, VisitDetailsModel } from '../../../models/visitDetails'

jest.mock('../../../services/auditService')
jest.mock('../../../services/emDatastoreVisitDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreVisitDetailsService = { getOrderSummary: jest.fn() } as unknown as EmDatastoreVisitDetailsService

jest.spyOn(VisitDetailsViewModel, 'construct')

describe('VisitDetailsController', () => {
  let visitDetailsController: VisitDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 123456789

  beforeEach(() => {
    visitDetailsController = new VisitDetailsController(auditService, emDatastoreVisitDetailsService)

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
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      visitDetails: [] as VisitDetails[],
      legacySubjectId: testOrderId,
    }

    emDatastoreVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([])

    await visitDetailsController.showVisitDetails(req, res, next)

    expect(VisitDetailsViewModel.construct).toHaveBeenCalledWith(testOrderId, [])
    expect(VisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/visit-details', expectedViewModel)
  })

  it('should render page with visit details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      visitDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'visit-details',
          properties: {
            legacySubjectId: testOrderId,
            legacyOrderId: testOrderId,
            address: {
              addressLine1: 'address line 1',
              addressLine2: 'address line 2',
              addressLine3: 'address line 3',
              addressLine4: null,
              postcode: 'address line 3',
            },
            actualWorkStartDateTime: eventDateTime,
            actualWorkEndDateTime: eventDateTime,
            visitNotes: 'TEST_NOTES',
            visitType: 'TEST_VISIT_TYPE',
            visitOutcome: 'TEST_OUTCOME',
          },
        } as TimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    emDatastoreVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([
      VisitDetailsModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
        address: {
          addressLine1: 'address line 1',
          addressLine2: 'address line 2',
          addressLine3: 'address line 3',
          addressLine4: null,
          postcode: 'address line 3',
        },
        actualWorkStartDateTime: eventDateTime,
        actualWorkEndDateTime: eventDateTime,
        visitNotes: 'TEST_NOTES',
        visitType: 'TEST_VISIT_TYPE',
        visitOutcome: 'TEST_OUTCOME',
      }),
    ])

    await visitDetailsController.showVisitDetails(req, res, next)

    expect(VisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/visit-details', expectedViewModel)
  })
})
