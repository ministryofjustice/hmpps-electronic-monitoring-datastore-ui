import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import AlcoholMonitoringDatastoreClient from '../../data/alcoholMonitoringDatastoreClient'

import AlcoholMonitoringVisitDetailsService from '../../services/alcoholMonitoring/visitDetailsService'
import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/alcoholMonitoring/visitDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(
  {} as AlcoholMonitoringDatastoreClient,
) as jest.Mocked<AlcoholMonitoringVisitDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      alcoholMonitoringVisitDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Alcohol monitoring visit details', () => {
  it(`creates an ALCOHOL_MONITORING_VISIT_DETAILS_PAGE audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.VISIT_HISTORY, { legacySubjectId: 'visit_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_VISIT_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests visit details from the alcohol monitoring visit details service`, async () => {
    alcoholMonitoringVisitDetailsService.getVisitDetails.mockResolvedValue([
      {
        legacySubjectId: 'visit_details_002',
      },
    ] as AlcoholMonitoringVisitDetails[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.VISIT_HISTORY, { legacySubjectId: 'visit_details_002' }))
      .expect(_res => {
        expect(alcoholMonitoringVisitDetailsService.getVisitDetails).toHaveBeenCalledWith({
          legacySubjectId: 'visit_details_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringVisitDetailsService.getVisitDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.VISIT_HISTORY, { legacySubjectId: 'visit_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays visit details from the alcohol monitoring visit details service`, async () => {
    alcoholMonitoringVisitDetailsService.getVisitDetails.mockResolvedValue([
      {
        legacySubjectId: 'visit_details_004',
        visitId: '123',
        visitType: 'test visit type',
        visitAttempt: 'attempt 1',
        dateVisitRaised: '2022-02-02T00:00:00Z',
        visitAddress: 'test visit address',
        visitNotes: 'visit notes',
        visitOutcome: 'visit outcome',
        actualWorkStartDateTime: '300',
        actualWorkEndDateTime: '300',
        visitRejectionReason: 'rejection reason',
        visitRejectionDescription: 'rejection description',
        visitCancelReason: 'cancel reason',
        visitCancelDescription: 'cancel description',
      },
    ] as AlcoholMonitoringVisitDetails[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.VISIT_HISTORY, { legacySubjectId: 'visit_details_004' }))
      .expect(res => {
        expect(res.text).toContain('test visit address')
        expect(res.text).toContain('visit notes')
        expect(res.text).toContain('visit outcome')
        expect(res.text).toContain('rejection reason')
        expect(res.text).toContain('rejection description')
        expect(res.text).toContain('cancel reason')
        expect(res.text).toContain('cancel description')
        expect(res.text).toContain('visit type')
        expect(res.text).toContain('attempt 1')
        expect(res.text).toContain('300')
        expect(res.text).toContain(' 2 February 2022')
      })
  })
})
