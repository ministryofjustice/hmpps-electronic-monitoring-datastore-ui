import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import AlcoholMonitoringDetailsService from '../../services/alcoholMonitoring/detailsService'
import AlcoholMonitoringDetailsController from './detailsController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../types/OrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/detailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringDetailsService = { getDetails: jest.fn() } as unknown as AlcoholMonitoringDetailsService

describe('AlcoholMonitoringDetailsController', () => {
  let controller: AlcoholMonitoringDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  it(`constructs the system under test and mocks appropriately`, () => {
    controller = new AlcoholMonitoringDetailsController(auditService, alcoholMonitoringDetailsService)
    expect(controller).not.toBeNull()
  })

  describe('Details', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      controller = new AlcoholMonitoringDetailsController(auditService, alcoholMonitoringDetailsService)

      req = createMockRequest({
        id: 'fakeId',
      })

      res = createMockResponse()
      res.status = jest.fn().mockReturnValue(res)
    })

    it(`logs hitting the page`, async () => {
      const expectedLogData = { who: 'fakeUserName', correlationId: 'fakeId' }

      controller.details(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.AM_ORDER_DETAILS_PAGE, expectedLogData)
    })

    it(`calls the DatastoreOrderService for data using the correct legacySubjectId parameter`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderServiceParams: OrderRequest = {
        userToken: 'fakeUserToken',
        legacySubjectId: expectedOrderId,
      }
      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      await controller.details(req, res, next)

      expect(alcoholMonitoringDetailsService.getDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderDetailsService fails`, async () => {
      alcoholMonitoringDetailsService.getDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.details(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderId = 'testId'
      const expectedOrderDetails = 'expectedOrderDetails'

      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        backUrl: `/alcohol-monitoring/${expectedOrderId}`,
        details: expectedOrderDetails,
      }

      alcoholMonitoringDetailsService.getDetails = jest.fn().mockResolvedValueOnce(expectedOrderDetails)

      await controller.details(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/details', expectedPageData)
    })
  })
})
