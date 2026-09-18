import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import AlcoholMonitoringDatastoreClient from '../../data/alcoholMonitoringDatastoreClient'

import AlcoholMonitoringEquipmentDetailsService from '../../services/alcoholMonitoring/equipmentDetailsService'
import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/alcoholMonitoring/equipmentDetailsService')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
const alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(
  {} as AlcoholMonitoringDatastoreClient,
) as jest.Mocked<AlcoholMonitoringEquipmentDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      alcoholMonitoringEquipmentDetailsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Integrity equipment details', () => {
  it(`creates an INTEGRITY_EQUIPMENT_DETAILS audit log record`, async () => {
    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, { legacySubjectId: 'equipment_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ALCOHOL_MONITORING_EQUIPMENT_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests equipment details from the alcohol monitoring equipment details service`, async () => {
    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails.mockResolvedValue([])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, { legacySubjectId: 'equipment_details_002' }))
      .expect(_res => {
        expect(alcoholMonitoringEquipmentDetailsService.getEquipmentDetails).toHaveBeenCalledWith({
          legacySubjectId: 'equipment_details_002',
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, { legacySubjectId: 'equipment_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays equipment details from the alcohol monitoring equipment details service`, async () => {
    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails.mockResolvedValue([
      {
        legacySubjectId: 'equipment_details_004',

        deviceType: 'test_device_type',
        deviceSerialNumber: 'test_device_serial_number',
        deviceAddressType: 'test_device_address_type',
        legFitting: 'test_leg_fitting',
        deviceInstalledDateTime: '2022-02-02T02:02:02',
        deviceRemovedDateTime: '2023-03-03T03:03:03',
        hmuInstallDateTime: '2024-04-04T04:04:04',
        hmuRemovedDateTime: '2025-05-05T05:05:05',
      },
    ] as AlcoholMonitoringEquipmentDetails[])

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, { legacySubjectId: 'equipment_details_004' }))
      .expect(res => {
        expect(res.text).toContain('test_device_type')
        expect(res.text).toContain('test_device_serial_number')
        expect(res.text).toContain('test_device_address_type')
        expect(res.text).toContain('test_leg_fitting')
        expect(res.text).toContain(' 2 February 2022')
        expect(res.text).toContain(' 3 March 2023')
        expect(res.text).toContain(' 4 April 2024')
        expect(res.text).toContain(' 5 May 2025')
      })
  })

  it(`displays message when no equipment details are returned from the alcohol monitoring equipment details service`, async () => {
    alcoholMonitoringEquipmentDetailsService.getEquipmentDetails.mockResolvedValue(
      [] as AlcoholMonitoringEquipmentDetails[],
    )

    return request(app)
      .get(buildUrl(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, { legacySubjectId: 'equipment_details_005' }))
      .expect(res => {
        expect(res.text).toContain('No equipment details found')
      })
  })
})
