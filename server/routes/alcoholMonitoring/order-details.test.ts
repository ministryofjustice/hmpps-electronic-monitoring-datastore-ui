import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import AlcoholMonitoringDatastoreClient from '../../data/alcoholMonitoringDatastoreClient'

import AlcoholMonitoringOrderDetailsService from '../../services/alcoholMonitoring/orderDetailsService'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const alcoholMonitoringOrderDetailsService = new AlcoholMonitoringOrderDetailsService(
  {} as AlcoholMonitoringDatastoreClient,
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

describe('AlcoholMonitoring order details', () => {
  it(`creates an ALCOHOL_MONITORING_ORDER_DETAILS audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.DETAILS, { legacySubjectId: 'order_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_ORDER_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests order details from the alcohol monitoring order details service`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_details_002',
      firstName: 'John',
      lastName: 'West',
    } as AlcoholMonitoringOrderDetails)

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.DETAILS, { legacySubjectId: 'order_details_002' }))
      .expect(_res => {
        expect(alcoholMonitoringOrderDetailsService.getOrderDetails).toHaveBeenCalledWith({
          legacySubjectId: 'order_details_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.DETAILS, { legacySubjectId: 'order_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays order details from the alcohol monitoring order details service`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_details_004',
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
    } as AlcoholMonitoringOrderDetails)

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.DETAILS, { legacySubjectId: 'order_details_004' }))
      .expect(res => {
        expect(res.text).toContain('Testopher')
        expect(res.text).toContain('Fakesmith')
        expect(res.text).toContain('an old tv show')
        expect(res.text).toContain(' 1 January 1950')
        expect(res.text).toContain('Sex')
        expect(res.text).toContain('Special instructions')
        expect(res.text).toContain('09876543210')
        expect(res.text).toContain('123 Fourth Street')
        expect(res.text).toContain('Fiveton')
        expect(res.text).toContain('Sixbury')
        expect(res.text).toContain('7AB 8CD')
        expect(res.text).toContain(' 1 January 2010')
        expect(res.text).toContain(' 1 January 2030')
        expect(res.text).toContain('Enforceable condition')
        expect(res.text).toContain('Community')
        expect(res.text).toContain('lovely and green')
        expect(res.text).toContain('A good outcome')
        expect(res.text).toContain('01234567890')
        expect(res.text).toContain('a@b.c')
        expect(res.text).toContain('no')
      })
  })
})
