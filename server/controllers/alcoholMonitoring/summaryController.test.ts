import { Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringDetailsService } from '../../services'
import AlcoholMonitoringSummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringDetailsService = {
  getOrderDetails: jest.fn(),
} as unknown as AlcoholMonitoringDetailsService

describe('Alcohol monitoring summary Controller', () => {
  let controller: AlcoholMonitoringSummaryController

  const expectedOrderId = 'testId'
  const req = createMockRequest({
    params: {
      legacySubjectId: expectedOrderId,
    },
    id: 'fakeId', // correlation-id
  })
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new AlcoholMonitoringSummaryController(auditService, alcoholMonitoringDetailsService)
    expect(controller).not.toBeNull()
  })

  describe('Alcohol Monitoring Summary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new AlcoholMonitoringSummaryController(auditService, alcoholMonitoringDetailsService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      await controller.summary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.AM_ORDER_SUMMARY_PAGE, expectedLogData)
    })

    it(`calls the service for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderServiceParams: GetOrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }

      await controller.summary(req, res, next)

      expect(alcoholMonitoringDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      alcoholMonitoringDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.summary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        orderDetails: expectedOrderDetails,
        backUrl: '/alcohol-monitoring',
        reports: {
          orderDetails: true,
          visitDetails: true,
          equipmentDetails: true,
          suspensionOfVisits: true,
          allEventHistory: true,
          services: true,
        },
      }

      alcoholMonitoringDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/summary', expectedPageData)
    })
  })
})
