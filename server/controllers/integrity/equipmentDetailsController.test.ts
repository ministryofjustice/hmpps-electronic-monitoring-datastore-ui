import session, { SessionData } from 'express-session'
import { Request, Response } from 'express'
import AuditService from '../../services/auditService'
import IntegrityEquipmentDetailsService from '../../services/integrity/equipmentDetailsService'
import IntegrityEquipmentDetailsController from './equipmentDetailsController'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsViewModel from '../../models/view-models/integrity/equipmentDetails'
import { IntegrityTimelineEventModel } from '../../models/integrity/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { IntegrityEquipmentDetails, IntegrityEquipmentDetailsModel } from '../../models/integrity/equipmentDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/equipmentDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreEquipmentDetailsService = { getEvents: jest.fn() } as unknown as IntegrityEquipmentDetailsService

jest.spyOn(EquipmentDetailsViewModel, 'construct')

describe('EquipmentDetailsController', () => {
  let equipmentDetailsController: IntegrityEquipmentDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    equipmentDetailsController = new IntegrityEquipmentDetailsController(
      auditService,
      emDatastoreEquipmentDetailsService,
    )

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
      backUrl: `/integrity/${testOrderId}`,
      equipmentDetails: [] as IntegrityEquipmentDetails[],
      legacySubjectId: testOrderId,
    }

    emDatastoreEquipmentDetailsService.getEquipmentDetails = jest.fn().mockResolvedValue([])

    await equipmentDetailsController.showEquipmentDetails(req, res, next)

    expect(EquipmentDetailsViewModel.construct).toHaveBeenCalledWith(testOrderId, `/integrity/${testOrderId}`, [])
    expect(EquipmentDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/equipment-details', expectedViewModel)
  })

  it('should render page with equipment details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/integrity/${testOrderId}`,
      equipmentDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'equipment-details',
          properties: {
            legacySubjectId: testOrderId,
            pid: {
              id: 'pid_id',
              equipmentCategoryDescription: 'pid category',
              installedDateTime: eventDateTime,
              removedDateTime: null,
            },
            hmu: {
              id: 'hmu_id',
              equipmentCategoryDescription: 'hmu category',
              installedDateTime: eventDateTime,
              removedDateTime: null,
            },
          },
        } as IntegrityTimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    emDatastoreEquipmentDetailsService.getEquipmentDetails = jest.fn().mockResolvedValue([
      IntegrityEquipmentDetailsModel.parse({
        legacySubjectId: testOrderId,
        pid: {
          id: 'pid_id',
          equipmentCategoryDescription: 'pid category',
          installedDateTime: eventDateTime,
          removedDateTime: null,
        },
        hmu: {
          id: 'hmu_id',
          equipmentCategoryDescription: 'hmu category',
          installedDateTime: eventDateTime,
          removedDateTime: null,
        },
      }),
    ])

    await equipmentDetailsController.showEquipmentDetails(req, res, next)

    expect(EquipmentDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/equipment-details', expectedViewModel)
  })
})
