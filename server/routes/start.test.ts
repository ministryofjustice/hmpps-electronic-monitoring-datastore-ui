import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../constants/paths'
import { Page } from '../constants/pages'
import { appWithAllRoutes, user } from './testutils/appSetup'

jest.mock('@ministryofjustice/hmpps-audit-client')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Start page', () => {
  it(`should render the start page successfully`, async () => {
    auditService.logPageView.mockResolvedValue()

    return request(app)
      .get(paths.START)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Electronic Monitoring Datastore')
      })
  })

  it(`creates an START_PAGE audit log record`, async () => {
    return request(app)
      .get(paths.START)
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.START, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
