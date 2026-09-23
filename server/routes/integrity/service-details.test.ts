import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityDatastoreClient from '../../data/integrityDatastoreClient'

import IntegrityServiceDetailsService from '../../services/integrity/serviceDetailsService'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/serviceDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const integrityServiceDetailsService = new IntegrityServiceDetailsService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<IntegrityServiceDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integrityServiceDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity service details', () => {
  it(`creates an INTEGRITY_SERVICE_DETAILS_PAGE audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.SERVICE_HISTORY, { legacySubjectId: 'service_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_SERVICE_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests service details from the integrity service details service`, async () => {
    integrityServiceDetailsService.getServiceDetails.mockResolvedValue([
      {
        legacySubjectId: 'service_details_002',
        serviceId: 321,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 1,
        sunday: 1,
      },
    ] as IntegrityServiceDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.SERVICE_HISTORY, { legacySubjectId: 'service_details_002' }))
      .expect(_res => {
        expect(integrityServiceDetailsService.getServiceDetails).toHaveBeenCalledWith({
          legacySubjectId: 'service_details_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integrityServiceDetailsService.getServiceDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.SERVICE_HISTORY, { legacySubjectId: 'service_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays service details from the integrity service details service`, async () => {
    integrityServiceDetailsService.getServiceDetails.mockResolvedValue([
      {
        legacySubjectId: 'service_details_004',
        serviceId: 321,
        serviceAddress1: 'address line 1',
        serviceAddress2: 'address line 2',
        serviceAddress3: 'address line 3',
        serviceAddressPostCode: 'postCode',
        serviceStartDate: '2022-02-02T02:02:02',
        serviceEndDate: '2022-02-02T02:02:02',
        curfewStartDate: '2022-02-02T02:02:02',
        curfewEndDate: '2022-02-02T02:02:02',
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 1,
        sunday: 1,
      },
    ] as IntegrityServiceDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.SERVICE_HISTORY, { legacySubjectId: 'service_details_004' }))
      .expect(res => {
        expect(res.text).toContain('address line 1')
        expect(res.text).toContain('address line 2')
        expect(res.text).toContain('address line 3')
        expect(res.text).toContain('postCode')
      })
  })
})
