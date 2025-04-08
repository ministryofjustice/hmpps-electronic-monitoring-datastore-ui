import { Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringSummaryService } from '../../services'
import AlcoholMonitoringSummaryController from './summaryController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../types/OrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/summaryService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringSummaryService = { getSummary: jest.fn() } as unknown as AlcoholMonitoringSummaryService

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
    controller = new AlcoholMonitoringSummaryController(auditService, alcoholMonitoringSummaryService)
    expect(controller).not.toBeNull()
  })

  describe('Alcohol Monitoring Summary', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new AlcoholMonitoringSummaryController(auditService, alcoholMonitoringSummaryService)

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      await controller.summary(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.AM_ORDER_SUMMARY_PAGE, expectedLogData)
    })

    it(`calls the service for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderServiceParams: OrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }

      await controller.summary(req, res, next)

      expect(alcoholMonitoringSummaryService.getSummary).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderService fails`, async () => {
      alcoholMonitoringSummaryService.getSummary = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.summary(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderDetails = 'expectedOrderDetails'
      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        summary: expectedOrderDetails,
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

      alcoholMonitoringSummaryService.getSummary = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/summary', expectedPageData)
    })
  })
})
