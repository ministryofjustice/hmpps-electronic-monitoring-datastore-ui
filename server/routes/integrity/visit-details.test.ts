import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityDatastoreClient from '../../data/integrityDatastoreClient'

import IntegrityVisitDetailsService from '../../services/integrity/visitDetailsService'
import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/visitDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const integrityVisitDetailsService = new IntegrityVisitDetailsService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<IntegrityVisitDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integrityVisitDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity service details', () => {
  it(`creates an INTEGRITY_VISIT_DETAILS_PAGE audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.VISIT_DETAILS, { legacySubjectId: 'visit_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_VISIT_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests service details from the integrity service details service`, async () => {
    integrityVisitDetailsService.getVisitDetails.mockResolvedValue([
      {
        legacySubjectId: 'visit_details_002',
      },
    ] as IntegrityVisitDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.VISIT_DETAILS, { legacySubjectId: 'visit_details_002' }))
      .expect(_res => {
        expect(integrityVisitDetailsService.getVisitDetails).toHaveBeenCalledWith({
          legacySubjectId: 'visit_details_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integrityVisitDetailsService.getVisitDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.VISIT_DETAILS, { legacySubjectId: 'visit_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays service details from the integrity service details service`, async () => {
    integrityVisitDetailsService.getVisitDetails.mockResolvedValue([
      {
        legacySubjectId: 'visit_details_004',
        address: {
          addressLine1: 'address line 1',
          addressLine2: 'address line 2',
          addressLine3: 'address line 3',
          addressLine4: undefined,
          postcode: 'postcode',
        },
        actualWorkStartDateTime: '2021-01-01T01:01:01',
        actualWorkEndDateTime: '2022-02-02T02:02:02',
        visitNotes: 'TEST_NOTES',
        visitType: 'TEST_VISIT_TYPE',
        visitOutcome: 'TEST_OUTCOME',
      },
    ] as IntegrityVisitDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.VISIT_DETAILS, { legacySubjectId: 'visit_details_004' }))
      .expect(res => {
        expect(res.text).toContain('address line 1')
        expect(res.text).toContain('address line 2')
        expect(res.text).toContain('address line 3')
        expect(res.text).toContain('postcode')
      })
  })
})
