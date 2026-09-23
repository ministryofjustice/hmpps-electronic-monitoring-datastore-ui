import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityDatastoreClient from '../../data/integrityDatastoreClient'

import IntegritySuspensionOfVisitsService from '../../services/integrity/suspensionOfVisitsService'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/suspensionOfVisitsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const integritySuspensionOfVisitsService = new IntegritySuspensionOfVisitsService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<IntegritySuspensionOfVisitsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integritySuspensionOfVisitsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity suspension of visits details', () => {
  it(`creates an INTEGRITY_SUSPENSION_OF_VISITS audit log record`, async () => {
    return request(app)
      .get(
        buildUrl(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS_HISTORY, { legacySubjectId: 'suspension_of_visits_001' }),
      )
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_SUSPENSION_OF_VISITS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests suspension of visits details from the integrity suspension of visits service`, async () => {
    integritySuspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([])

    return request(app)
      .get(
        buildUrl(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS_HISTORY, { legacySubjectId: 'suspension_of_visits_002' }),
      )
      .expect(_res => {
        expect(integritySuspensionOfVisitsService.getSuspensionOfVisits).toHaveBeenCalledWith({
          legacySubjectId: 'suspension_of_visits_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integritySuspensionOfVisitsService.getSuspensionOfVisits = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(
        buildUrl(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS_HISTORY, { legacySubjectId: 'suspension_of_visits_003' }),
      )
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays suspension of visits details from the integrity suspension of visits service`, async () => {
    integritySuspensionOfVisitsService.getSuspensionOfVisits.mockResolvedValue([
      {
        legacySubjectId: 'suspension_of_visits_004',
        suspensionOfVisits: 'Yes',
        requestedDate: '2001-01-01T01:01:01',
        startDate: '2002-02-02T02:02:02',
        startTime: '03:03:03',
        endDate: '2004-04-04T04:04:04',
      },
    ] as IntegritySuspensionOfVisits[])

    return request(app)
      .get(
        buildUrl(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS_HISTORY, { legacySubjectId: 'suspension_of_visits_004' }),
      )
      .expect(res => {
        expect(res.text).toContain('Yes')
        expect(res.text).toContain(' 1 January 2001')
        expect(res.text).toContain(' 2 February 2002')
        expect(res.text).toContain(' 2:02am')
        expect(res.text).toContain(' 4 April 2004')
      })
  })
})
