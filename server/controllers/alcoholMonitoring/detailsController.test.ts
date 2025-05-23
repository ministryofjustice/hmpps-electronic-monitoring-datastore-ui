import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import AlcoholMonitoringDetailsService from '../../services/alcoholMonitoring/orderDetailsService'
import AlcoholMonitoringDetailsController from './detailsController'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { OrderRequest } from '../../types/OrderRequest'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const alcoholMonitoringDetailsService = { getOrderDetails: jest.fn() } as unknown as AlcoholMonitoringDetailsService

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

      expect(alcoholMonitoringDetailsService.getOrderDetails).toHaveBeenCalledWith(expectedOrderServiceParams)
    })

    it(`returns correct error when orderDetailsService fails`, async () => {
      alcoholMonitoringDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
        throw new Error('Expected error message')
      })

      await expect(controller.details(req, res, next)).rejects.toThrow('Expected error message')
    })

    it(`renders the page with appropriate data`, async () => {
      const expectedOrderId = 'testId'
      const mockOrderDetails = {
        legacySubjectId: expectedOrderId,
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01T00:00:00',
        sex: 'Sex',
        specialInstructions: 'Special instructions',
        phoneNumber: '09876543210',
        address1: '123 Fourth Street',
        address2: 'Fiveton',
        address3: 'Sixbury',
        postcode: '7AB 8CD',
        orderStartDate: '2010-01-01T00:00:00',
        orderEndDate: '2030-01-01T00:00:00',
        enforceableCondition: 'Enforceable condition',
        orderType: 'Community',
        orderTypeDescription: 'lovely and green',
        orderEndOutcome: 'A good outcome',
        responsibleOrganisationPhoneNumber: '01234567890',
        responsibleOrganisationEmail: 'a@b.c',
        tagAtSource: 'no',
      }

      req = createMockRequest({
        params: {
          legacySubjectId: expectedOrderId,
        },
      })

      const expectedPageData = {
        legacySubjectId: expectedOrderId,
        backUrl: `/orders/alcohol-monitoring/${expectedOrderId}`,
        deviceWearerDetails: {
          legacySubjectId: expectedOrderId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01T00:00:00',
          legacySex: 'Sex',
          phoneOrMobileNumber: '09876543210',
          primaryAddressLine1: '123 Fourth Street',
          primaryAddressLine2: 'Fiveton',
          primaryAddressLine3: 'Sixbury',
          primaryAddressPostcode: '7AB 8CD',
        },
        orderDetails: {
          orderStartDate: '2010-01-01T00:00:00',
          orderEndDate: '2030-01-01T00:00:00',
          enforceableCondition: 'Enforceable condition',
          orderType: 'Community',
          orderTypeDescription: 'lovely and green',
          orderEndOutcome: 'A good outcome',
          responsibleOrganisationPhoneNumber: '01234567890',
          responsibleOrganisationEmail: 'a@b.c',
          tagAtSource: 'no',
          specialInstructions: 'Special instructions',
        },
      }

      alcoholMonitoringDetailsService.getOrderDetails = jest.fn().mockResolvedValueOnce(mockOrderDetails)

      await controller.details(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/alcohol-monitoring/details', expectedPageData)
    })
  })
})
