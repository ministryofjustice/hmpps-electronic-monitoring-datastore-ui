import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import AlcoholMonitoringDatastoreClient from '../../data/alcoholMonitoringDatastoreClient'

import AlcoholMonitoringServiceDetailsService from '../../services/alcoholMonitoring/serviceDetailsService'
import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/alcoholMonitoring/serviceDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const alcoholMonitoringServiceDetailsService = new AlcoholMonitoringServiceDetailsService(
  {} as AlcoholMonitoringDatastoreClient,
) as jest.Mocked<AlcoholMonitoringServiceDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      alcoholMonitoringServiceDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('AlcoholMonitoring service details', () => {
  it(`creates an ALCOHOL_MONITORING_SERVICE_DETAILS audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, { legacySubjectId: 'service_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_SERVICE_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests service details from the alcohol monitoring service details service`, async () => {
    alcoholMonitoringServiceDetailsService.getServiceDetails.mockResolvedValue([
      {
        legacySubjectId: 'service_details_002',
      },
    ] as AlcoholMonitoringServiceDetails[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, { legacySubjectId: 'service_details_002' }))
      .expect(_res => {
        expect(alcoholMonitoringServiceDetailsService.getServiceDetails).toHaveBeenCalledWith({
          legacySubjectId: 'service_details_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringServiceDetailsService.getServiceDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, { legacySubjectId: 'service_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays service details from the alcohol monitoring service details service`, async () => {
    alcoholMonitoringServiceDetailsService.getServiceDetails.mockResolvedValue([
      {
        legacySubjectId: 'service_details_004',
        serviceStartDate: '2022-02-02T02:02:02',
        serviceEndDate: '2022-02-02T02:02:02',
        serviceAddress: 'Test service address',
        equipmentStartDate: '2022-02-02T02:02:02',
        equipmentEndDate: '2022-02-02T02:02:02',
        hmuSerialNumber: 'Test HMU serial number',
        deviceSerialNumber: 'Test device serial number',
      },
    ] as AlcoholMonitoringServiceDetails[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, { legacySubjectId: 'service_details_004' }))
      .expect(res => {
        expect(res.text).toContain('Test service address')
        expect(res.text).toContain(' 2 February 2022')
        expect(res.text).toContain('Test HMU serial number')
        expect(res.text).toContain('Test device serial number')
      })
  })
})
