import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../../../services/auditService'
import EmDatastoreCurfewTimetableService from '../../../services/emDatastoreCurfewTimetableService'
import CurfewTimetableController from './curfewTimetableController'
// eslint-disable-next-line import/no-named-as-default
import CurfewTimetableViewModel from '../../../models/view-models/curfewTimetable'
import { TimelineEventModel } from '../../../models/view-models/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../../testutils/mocks/mockExpress'
import { CurfewTimetable, CurfewTimetableModel } from '../../../models/curfewTimetable'

jest.mock('../../../services/auditService')
jest.mock('../../../services/emDatastoreCurfewTimetableService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreCurfewTimetableService = { getEvents: jest.fn() } as unknown as EmDatastoreCurfewTimetableService

jest.spyOn(CurfewTimetableViewModel, 'construct')

describe('CurfewTimetableController', () => {
  let curfewTimetableController: CurfewTimetableController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 123456789

  beforeEach(() => {
    curfewTimetableController = new CurfewTimetableController(auditService, emDatastoreCurfewTimetableService)

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
      curfewTimetable: [] as CurfewTimetable[],
      legacySubjectId: testOrderId,
    }

    emDatastoreCurfewTimetableService.getCurfewTimetable = jest.fn().mockResolvedValue([])

    await curfewTimetableController.showCurfewTimetable(req, res, next)

    expect(CurfewTimetableViewModel.construct).toHaveBeenCalledWith(testOrderId, [])
    expect(CurfewTimetableViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/curfew-timetable', expectedViewModel)
  })

  it('should render page with visit details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/orders/${testOrderId}/summary`,
      curfewTimetable: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'curfew-timetable',
          properties: {
            legacySubjectId: testOrderId,
            serviceId: 321,
            serviceAddress1: 'address line 1',
            serviceAddress2: 'address line 2',
            serviceAddress3: 'address line 3',
            serviceAddressPostcode: 'postcode',
            serviceStartDate: eventDateTime,
            serviceEndDate: eventDateTime,
            curfewStartDate: eventDateTime,
            curfewEndDate: eventDateTime,
            monday: 1,
            tuesday: 1,
            wednesday: 1,
            thursday: 1,
            friday: 1,
            saturday: 1,
            sunday: 1,
          },
        } as TimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    emDatastoreCurfewTimetableService.getCurfewTimetable = jest.fn().mockResolvedValue([
      CurfewTimetableModel.parse({
        legacySubjectId: testOrderId,
        serviceId: 321,
        serviceAddress1: 'address line 1',
        serviceAddress2: 'address line 2',
        serviceAddress3: 'address line 3',
        serviceAddressPostcode: 'postcode',
        serviceStartDate: eventDateTime,
        serviceEndDate: eventDateTime,
        curfewStartDate: eventDateTime,
        curfewEndDate: eventDateTime,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 1,
        sunday: 1,
      }),
    ])

    await curfewTimetableController.showCurfewTimetable(req, res, next)

    expect(CurfewTimetableViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/order/curfew-timetable', expectedViewModel)
  })
})
