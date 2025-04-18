import { Request, Response } from 'express'
import { AuditService, AlcoholMonitoringVisitDetailsService } from '../../services'
import AlcoholMonitoringVisitDetailsController from './visitDetailsController'
// eslint-disable-next-line import/no-named-as-default
import AlcoholMonitoringVisitDetailsViewModel from '../../models/view-models/alcoholMonitoring/visitDetails'
import { AlcoholMonitoringTimelineEventModel } from '../../models/alcoholMonitoring/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import {
  AlcoholMonitoringVisitDetails,
  AlcoholMonitoringVisitDetailsModel,
} from '../../models/alcoholMonitoring/visitDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/visitDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringVisitDetailsService = {
  getOrderSummary: jest.fn(),
} as unknown as AlcoholMonitoringVisitDetailsService

jest.spyOn(AlcoholMonitoringVisitDetailsViewModel, 'construct')

describe('AlcoholMonitoringVisitDetailsController', () => {
  let alcoholMonitoringVisitDetailsController: AlcoholMonitoringVisitDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    alcoholMonitoringVisitDetailsController = new AlcoholMonitoringVisitDetailsController(
      auditService,
      alcoholMonitoringVisitDetailsService,
    )

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/orders/alcohol-monitoring/${testOrderId}`,
      visitDetails: [] as AlcoholMonitoringVisitDetails[],
      legacySubjectId: testOrderId,
    }

    alcoholMonitoringVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([])

    await alcoholMonitoringVisitDetailsController.showVisitDetails(req, res, next)

    expect(AlcoholMonitoringVisitDetailsViewModel.construct).toHaveBeenCalledWith(
      testOrderId,
      `/orders/alcohol-monitoring/${testOrderId}`,
      [],
    )
    expect(AlcoholMonitoringVisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/visit-details', expectedViewModel)
  })

  it('should render page with visit details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const visitDetails = AlcoholMonitoringVisitDetailsModel.parse({
      legacySubjectId: testOrderId,
      visitId: '300',
      visitType: 'visit type',
      visitAttempt: 'attempt 1',
      dateVisitRaised: eventDateTime,
      visitAddress: 'test visit address',
      visitNotes: 'visit notes',
      visitOutcome: 'visit outcome',
      actualWorkStartDateTime: eventDateTime,
      actualWorkEndDateTime: eventDateTime,
      visitRejectionReason: 'rejection reason',
      visitRejectionDescription: 'rejection description',
      visitCancelReason: 'cancel reason',
      visitCancelDescription: 'cancel description',
    })

    const expectedViewModel = {
      backUrl: `/orders/alcohol-monitoring/${testOrderId}`,
      visitDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'am-visit-details',
          properties: visitDetails,
        } as AlcoholMonitoringTimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    alcoholMonitoringVisitDetailsService.getVisitDetails = jest.fn().mockResolvedValue([visitDetails])

    await alcoholMonitoringVisitDetailsController.showVisitDetails(req, res, next)

    expect(AlcoholMonitoringVisitDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/visit-details', expectedViewModel)
  })
})
