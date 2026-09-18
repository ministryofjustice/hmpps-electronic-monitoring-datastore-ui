import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'

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

describe('Integrity orders list', () => {
  it('redirects to the search page when the search id is empty', async () => {
    return request(app).get(`${paths.INTEGRITY_ORDER.INDEX}?search_id=`).expect(302).expect('Location', paths.SEARCH)
  })

  it('redirects to the search page when the search id is not present', async () => {
    return request(app).get(paths.INTEGRITY_ORDER.INDEX).expect(302).expect('Location', paths.SEARCH)
  })

  it(`creates an INTEGRITY_ORDERS_LIST_PAGE audit log record`, async () => {
    return request(app)
      .get(`${paths.INTEGRITY_ORDER.INDEX}?search_id=fake_search_004`)
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_RESULTS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests search results from the integrity order details service`, async () => {
    integrityOrderDetailsService.getSearchResults.mockResolvedValue([
      {
        legacyOrderId: '1',
      } as IntegrityOrderDetails,
    ])

    return request(app)
      .get(`${paths.INTEGRITY_ORDER.INDEX}?search_id=fake_search_003`)
      .expect(_res => {
        expect(integrityOrderDetailsService.getSearchResults).toHaveBeenCalledWith({
          queryExecutionId: 'fake_search_003',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`renders the integrity orders list successfully`, async () => {
    auditService.logPageView.mockResolvedValue(null)
    integrityOrderDetailsService.getSearchResults.mockResolvedValue([
      {
        legacyOrderId: '1',
      } as IntegrityOrderDetails,
    ])

    return request(app)
      .get(`${paths.INTEGRITY_ORDER.INDEX}?search_id=fake_search_001`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search results')
      })
  })

  it(`renders an empty integrity orders list successfully`, async () => {
    auditService.logPageView.mockResolvedValue(null)
    integrityOrderDetailsService.getSearchResults.mockResolvedValue([])

    return request(app)
      .get(`${paths.INTEGRITY_ORDER.INDEX}?search_id=fake_search_002`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, no results were found for this search')
      })
  })
})
