import { Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringOrderDetailsService } from '../../services'
import AlcoholMonitoringSummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringOrderSummaryView } from '../../models/view-models/alcoholMonitoringOrderSummary'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringOrderDetailsService = {
  getOrderDetails: jest.fn(),
} as unknown as AlcoholMonitoringOrderDetailsService

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

  describe('Alcohol Monitoring order summary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new AlcoholMonitoringSummaryController(auditService, alcoholMonitoringOrderDetailsService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.summary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.AM_ORDER_SUMMARY_PAGE, expectedLogData)
    })

    it(`calls the service for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderServiceParams: GetOrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }

      alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce({})

      await controller.summary(req, res, next)

      expect(alcoholMonitoringOrderDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.summary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = {
        firstName: 'John',
        lastName: 'West',
      }

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        orderSummary: {
          alias: undefined,
          dateOfBirth: undefined,
          legacySubjectId: 'testId',
          name: 'John West',
          orderEndDate: undefined,
          orderStartDate: undefined,
          primaryAddress: [],
        },
        backUrl: '/alcohol-monitoring',
      } as AlcoholMonitoringOrderSummaryView

      alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/summary', expectedPageData)
    })
  })
})
