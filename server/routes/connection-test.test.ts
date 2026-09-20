import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../constants/paths'
import { Page } from '../constants/pages'
import { appWithAllRoutes, user } from './testutils/appSetup'

import EmDatastoreConnectionService from '../services/emDatastoreConnectionService'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/emDatastoreOrderSearchService')
jest.mock('../services/emDatastoreConnectionService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const emDatastoreConnectionService = new EmDatastoreConnectionService(
  {} as never,
) as jest.Mocked<EmDatastoreConnectionService>

emDatastoreConnectionService.test.mockImplementation().mockResolvedValue({} as JSON)

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreConnectionService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('API connection test page', () => {
  it(`should render the API connection test page successfully`, async () => {
    auditService.logPageView.mockResolvedValue()

    return request(app)
      .get(paths.API_CONNECTION_TEST)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('API test page')
      })
  })

  it(`creates an API_CONNECTION_TEST_PAGE audit log record`, async () => {
    return request(app)
      .get(paths.API_CONNECTION_TEST)
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.API_CONNECTION_TEST, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
