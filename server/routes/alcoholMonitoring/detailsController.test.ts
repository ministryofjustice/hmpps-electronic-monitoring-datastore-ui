import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../../services/auditService'
import AlcoholMonitoringOrderDetailsService from '../../services/alcoholMonitoring/orderDetailsService'
import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const alcoholMonitoringOrderDetailsService = new AlcoholMonitoringOrderDetailsService(
  null,
) as jest.Mocked<AlcoholMonitoringOrderDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      alcoholMonitoringOrderDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /alcohol-monitoring/:legacySubjectId/details', () => {
  it('renders the alcohol monitoring details page', () => {
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
    } as AlcoholMonitoringOrderDetails

    auditService.logPageView.mockResolvedValue(null)
    alcoholMonitoringOrderDetailsService.getOrderDetails.mockResolvedValueOnce(mockOrderDetails)

    return request(app)
      .get(`/alcohol-monitoring/${expectedOrderId}/details`)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        /*
        expect(res.text).toContain({
          legacySubjectId: expectedOrderId,
          backUrl: `/alcohol-monitoring/${expectedOrderId}`,
          deviceWearerDetails: {
            legacySubjectId: expectedOrderId,
            firstName: 'Testopher',
            lastName: 'Fakesmith',
            alias: 'an old tv show',
            dateOfBirth: '1950-01-01T00:00:00',
            legacySex: 'Sex',
            phoneOrMobileNumber: '09876543210',
            primaryAddress: ['123 Fourth Street', 'Fiveton', 'Sixbury', '7AB 8CD'],
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
        })
        */

        expect(auditService.logPageView).toHaveBeenCalledWith(Page.AM_ORDER_DETAILS_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })

        expect(alcoholMonitoringOrderDetailsService.getOrderDetails).toHaveBeenCalledWith({
          userToken: 'token',
          legacySubjectId: expectedOrderId,
        } as GetOrderRequest)
      })
  })

  it('handles API errors (e.g. 500)', async () => {
    const expectedOrderId = 'testId'

    const serverError = Object.assign(new Error('Some problem calling external api!'), {
      data: { status: 500 },
    })

    alcoholMonitoringOrderDetailsService.getOrderDetails.mockRejectedValue(serverError)

    return request(app)
      .get(`/alcohol-monitoring/${expectedOrderId}/details`)
      .expect('Content-Type', /html/)
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling external api!')
      })
  })
})
