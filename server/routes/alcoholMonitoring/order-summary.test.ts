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

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
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

describe('AlcoholMonitoring order summary', () => {
  it(`creates an ALCOHOL_MONITORING_ORDER_SUMMARY_PAGE audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId: 'order_summary_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_ORDER_SUMMARY, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests order summary from the alcoholMonitoring order details service`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_summary_002',
      firstName: 'John',
      lastName: 'West',
    } as AlcoholMonitoringOrderDetails)

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId: 'order_summary_002' }))
      .expect(_res => {
        expect(alcoholMonitoringOrderDetailsService.getOrderDetails).toHaveBeenCalledWith({
          legacySubjectId: 'order_summary_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId: 'order_summary_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays order summary from the alcoholMonitoring order details service`, async () => {
    alcoholMonitoringOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_summary_004',
      firstName: 'John',
      lastName: 'West',
    } as AlcoholMonitoringOrderDetails)

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId: 'order_summary_004' }))
      .expect(res => {
        expect(res.text).toContain('John')
        expect(res.text).toContain('West')
      })
  })
})
