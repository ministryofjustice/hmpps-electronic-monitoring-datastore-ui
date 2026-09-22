import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../constants/paths'
import { Page } from '../constants/pages'
import { appWithAllRoutes, flashProvider, user } from './testutils/appSetup'

import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/emDatastoreOrderSearchService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(
  {} as never,
) as jest.Mocked<EmDatastoreOrderSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreOrderSearchService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Order details search page', () => {
  it(`Renders the order details search page`, async () => {
    auditService.logPageView.mockResolvedValue()

    return request(app)
      .get(paths.SEARCH)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for order details')
      })
  })

  it(`Creates an ORDER_DETAILS_SEARCH_PAGE audit log record`, async () => {
    return request(app)
      .get(paths.SEARCH)
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`Includes the submitted order details search input values`, async () => {
    auditService.logPageView.mockResolvedValue()

    flashProvider.mockImplementation(key => {
      if (key === 'formData') {
        return [JSON.stringify({ searchType: '1', firstName: 'bar' })]
      }
      if (key === 'validationErrors') {
        return [
          JSON.stringify({
            error: 'Invalid option: expected one of "integrity"|"alcohol-monitoring"',
            field: 'searchType',
          }),
        ]
      }

      return undefined
    })

    return request(app)
      .get(paths.SEARCH)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for order details')
        expect(res.text).toContain(' value="bar"')
      })
  })
})
