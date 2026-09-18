import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityDatastoreClient from '../../data/integrityDatastoreClient'

import IntegrityOrderDetailsService from '../../services/integrity/orderDetailsService'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/orderDetailsService')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
const integrityOrderDetailsService = new IntegrityOrderDetailsService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<IntegrityOrderDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integrityOrderDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity order details', () => {
  it(`creates an INTEGRITY_ORDER_DETAILS_PAGE audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.DETAILS, { legacySubjectId: 'order_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_ORDER_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests order details from the integrity order details service`, async () => {
    integrityOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_details_002',
      firstName: 'John',
      lastName: 'West',
    } as IntegrityOrderDetails)

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.DETAILS, { legacySubjectId: 'order_details_002' }))
      .expect(_res => {
        expect(integrityOrderDetailsService.getOrderDetails).toHaveBeenCalledWith({
          legacySubjectId: 'order_details_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integrityOrderDetailsService.getOrderDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.DETAILS, { legacySubjectId: 'order_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays order details from the integrity order details service`, async () => {
    integrityOrderDetailsService.getOrderDetails.mockResolvedValue({
      legacyOrderId: 'order_details_004',
      firstName: 'John',
      lastName: 'West',
    } as IntegrityOrderDetails)

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.DETAILS, { legacySubjectId: 'order_details_004' }))
      .expect(res => {
        expect(res.text).toContain('John')
        expect(res.text).toContain('West')
      })
  })
})
