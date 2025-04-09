import { Request, Response } from 'express'
import AuditService from '../../services/auditService'
import AlcoholMonitoringEquipmentDetailsService from '../../services/alcoholMonitoring/equipmentDetailsService'
import AlcoholMonitoringEquipmentDetailsController from './equipmentDetailsController'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsViewModel from '../../models/view-models/alcoholMonitoring/equipmentDetails'
import { AlcoholMonitoringTimelineEventModel } from '../../models/alcoholMonitoring/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { AlcoholMonitoringEquipmentDetail } from '../../models/alcoholMonitoring/equipmentDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/equipmentDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringEquipmentDetailsService = {
  getEquipmentDetails: jest.fn(),
} as unknown as AlcoholMonitoringEquipmentDetailsService

jest.spyOn(EquipmentDetailsViewModel, 'construct')

describe('EquipmentDetailsController', () => {
  let alcoholMonitoringEquipmentDetailsController: AlcoholMonitoringEquipmentDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = 'AM123456789'

  beforeEach(() => {
    alcoholMonitoringEquipmentDetailsController = new AlcoholMonitoringEquipmentDetailsController(
      auditService,
      alcoholMonitoringEquipmentDetailsService,
    )

    req = createMockRequest({
      params: { legacySubjectId: testOrderId },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      equipmentDetails: [] as AlcoholMonitoringEquipmentDetail[],
      legacySubjectId: testOrderId,
    }

    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails = jest.fn().mockResolvedValue([])

    await alcoholMonitoringEquipmentDetailsController.showEquipmentDetails(req, res, next)

    expect(EquipmentDetailsViewModel.construct).toHaveBeenCalledWith(
      testOrderId,
      `/alcohol-monitoring/${testOrderId}`,
      [],
    )
    expect(EquipmentDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/equipment-details', expectedViewModel)
  })

  it('should render page with equipment details', async () => {
    const expectedViewModel = {
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      equipmentDetails: [
        {
          legacySubjectId: testOrderId,
          legacyOrderId: testOrderId,
          isoDateTime: undefined,
          dateTime: null,
          date: undefined,
          eventType: 'am-equipment-details',
          properties: {
            legacySubjectId: testOrderId,
            legacyOrderId: testOrderId,
          },
        } as AlcoholMonitoringTimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    const expectedResponse = [
      {
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
      },
    ]

    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails = jest.fn().mockResolvedValue(expectedResponse)

    await alcoholMonitoringEquipmentDetailsController.showEquipmentDetails(req, res, next)

    expect(EquipmentDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/equipment-details', expectedViewModel)
  })
})
