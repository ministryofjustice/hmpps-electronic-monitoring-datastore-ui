import { Request, Response } from 'express'
import AuditService from '../../services/auditService'
import AlcoholMonitoringEquipmentDetailsService from '../../services/alcoholMonitoring/equipmentDetailsService'
import AlcoholMonitoringEquipmentDetailsController from './equipmentDetailsController'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsViewModel from '../../models/view-models/equipmentDetails'
import { TimelineEventModel } from '../../models/view-models/TimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { EquipmentDetails, EquipmentDetailsModel } from '../../models/equipmentDetails'

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

  const testOrderId = 123456789

  beforeEach(() => {
    alcoholMonitoringEquipmentDetailsController = new AlcoholMonitoringEquipmentDetailsController(
      auditService,
      alcoholMonitoringEquipmentDetailsService,
    )

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      equipmentDetails: [] as EquipmentDetails[],
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
    const eventDateTime = '2022-02-02T02:02:02'

    const expectedViewModel = {
      backUrl: `/alcohol-monitoring/${testOrderId}`,
      equipmentDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'equipment-details',
          properties: {
            legacySubjectId: testOrderId,
            legacyOrderId: testOrderId,
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
        } as TimelineEventModel,
      ],
      legacySubjectId: testOrderId,
    }

    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails = jest.fn().mockResolvedValue([
      EquipmentDetailsModel.parse({
        legacySubjectId: testOrderId,
        legacyOrderId: testOrderId,
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

    await alcoholMonitoringEquipmentDetailsController.showEquipmentDetails(req, res, next)

    expect(EquipmentDetailsViewModel.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/equipment-details', expectedViewModel)
  })
})
