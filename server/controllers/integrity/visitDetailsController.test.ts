import { Request, Response } from 'express'
import { AuditService, IntegrityVisitDetailsService } from '../../services'
import IntegrityVisitDetailsController from './visitDetailsController'
// eslint-disable-next-line import/no-named-as-default
import IntegrityVisitDetailsViewModel from '../../models/view-models/integrity/visitDetails'
import { IntegrityTimelineEventModel } from '../../models/integrity/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { IntegrityVisitDetails, IntegrityVisitDetailsModel } from '../../models/integrity/visitDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/visitDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const emDatastoreVisitDetailsService = { getOrderSummary: jest.fn() } as unknown as IntegrityVisitDetailsService

jest.spyOn(IntegrityVisitDetailsViewModel, 'construct')

describe('IntegrityVisitDetailsController', () => {
  let integrityVisitDetailsController: IntegrityVisitDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    integrityVisitDetailsController = new IntegrityVisitDetailsController(auditService, emDatastoreVisitDetailsService)

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/integrity/${testOrderId}`,
      visitDetails: [] as IntegrityVisitDetails[],
      legacySubjectId: testOrderId,
    }

    emDatastoreVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([])

    await integrityVisitDetailsController.showVisitDetails(req, res, next)

    expect(IntegrityVisitDetailsViewModel.construct).toHaveBeenCalledWith(testOrderId, `/integrity/${testOrderId}`, [])
    expect(IntegrityVisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/visit-details', expectedViewModel)
  })

  it('should render page with visit details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/integrity/${testOrderId}`,
      visitDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'visit-details',
          properties: {
            legacySubjectId: testOrderId,
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
        } as IntegrityTimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    emDatastoreVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([
      IntegrityVisitDetailsModel.parse({
        legacySubjectId: testOrderId,
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

    await integrityVisitDetailsController.showVisitDetails(req, res, next)

    expect(IntegrityVisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/visit-details', expectedViewModel)
  })
})
