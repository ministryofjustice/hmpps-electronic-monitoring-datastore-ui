import { Request, Response } from 'express'
import { AuditService, AlcoholMonitoringServiceDetailsService } from '../../services'
import AlcoholMonitoringServiceDetailsController from './serviceDetailsController'
// eslint-disable-next-line import/no-named-as-default
import { AlcoholMonitoringServiceDetailsView } from '../../models/view-models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringTimelineEvent } from '../../models/view-models/alcoholMonitoringTimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/serviceDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringServiceDetailsService = {
  getServiceDetails: jest.fn(),
} as unknown as AlcoholMonitoringServiceDetailsService

jest.spyOn(AlcoholMonitoringServiceDetailsView, 'construct')

describe('AlcoholMonitoringServiceDetailsController', () => {
  let alcoholMonitoringServiceDetailsController: AlcoholMonitoringServiceDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    alcoholMonitoringServiceDetailsController = new AlcoholMonitoringServiceDetailsController(
      auditService,
      alcoholMonitoringServiceDetailsService,
    )

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/orders/alcohol-monitoring/${testOrderId}`,
      serviceDetails: [] as AlcoholMonitoringServiceDetails[],
    }

    alcoholMonitoringServiceDetailsService.getServiceDetails = jest.fn().mockResolvedValue([])

    await alcoholMonitoringServiceDetailsController.showServiceDetails(req, res, next)

    expect(AlcoholMonitoringServiceDetailsView.construct).toHaveBeenCalledWith(
      testOrderId,
      `/orders/alcohol-monitoring/${testOrderId}`,
      [],
    )
    expect(AlcoholMonitoringServiceDetailsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/service-details', expectedViewModel)
  })

  it('should render page with service details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const serviceDetails = {
      legacySubjectId: testOrderId,
      serviceId: 321,
      serviceAddress1: 'address line 1',
      serviceAddress2: 'address line 2',
      serviceAddress3: 'address line 3',
      serviceAddressPostCode: 'postCode',
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
    }

    const expectedViewModel = {
      backUrl: `/orders/alcohol-monitoring/${testOrderId}`,
      serviceDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'am-service-details',
          properties: serviceDetails,
        } as AlcoholMonitoringTimelineEvent,
      ],
      legacySubjectId: testOrderId,
    }

    alcoholMonitoringServiceDetailsService.getServiceDetails = jest.fn().mockResolvedValue([serviceDetails])

    await alcoholMonitoringServiceDetailsController.showServiceDetails(req, res, next)

    expect(AlcoholMonitoringServiceDetailsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/service-details', expectedViewModel)
  })
})
