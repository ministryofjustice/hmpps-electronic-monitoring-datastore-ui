import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../../constants/paths'
import { Page } from '../../constants/pages'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import { buildUrl } from '../../utils/utils'

import IntegrityEquipmentDetailsService from '../../services/integrity/equipmentDetailsService'
import { IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/integrity/equipmentDetailsService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(
  {} as never,
) as jest.Mocked<IntegrityEquipmentDetailsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      integrityEquipmentDetailsService,
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
      .get(buildUrl(paths.INTEGRITY_ORDER.EQUIPMENT_HISTORY, { legacySubjectId: 'equipment_details_001' }))
      .expect(_res => {
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INTEGRITY_EQUIPMENT_DETAILS, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it(`requests equipment details from the integrity equipment details service`, async () => {
    integrityEquipmentDetailsService.getEquipmentDetails.mockResolvedValue([])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EQUIPMENT_HISTORY, { legacySubjectId: 'equipment_details_002' }))
      .expect(_res => {
        expect(integrityEquipmentDetailsService.getEquipmentDetails).toHaveBeenCalledWith({
          legacySubjectId: 'equipment_details_002',
          restricted: false,
          userToken: 'token',
        })
      })
  })

  it(`returns correct error when service fails`, async () => {
    integrityEquipmentDetailsService.getEquipmentDetails = jest.fn().mockImplementation(() => {
      throw new Error('Expected error message')
    })

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EQUIPMENT_HISTORY, { legacySubjectId: 'equipment_details_003' }))
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Problem with the service')
      })
  })

  it(`displays equipment details from the integrity equipment details service`, async () => {
    integrityEquipmentDetailsService.getEquipmentDetails.mockResolvedValue([
      {
        legacySubjectId: 'equipment_details_004',
        pid: {
          id: 'pid_id',
          equipmentCategoryDescription: 'pid category',
          installedDateTime: '2022-02-02T02:02:02',
          removedDateTime: undefined,
        },
        hmu: {
          id: 'hmu_id',
          equipmentCategoryDescription: 'hmu category',
          installedDateTime: '2022-02-02T02:02:02',
          removedDateTime: undefined,
        },
      },
    ] as IntegrityEquipmentDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EQUIPMENT_HISTORY, { legacySubjectId: 'equipment_details_004' }))
      .expect(res => {
        expect(res.text).toContain('pid category')
        expect(res.text).toContain('hmu category')
      })
  })

  it(`displays message when no equipment details are returned from the integrity equipment details service`, async () => {
    integrityEquipmentDetailsService.getEquipmentDetails.mockResolvedValue([] as IntegrityEquipmentDetails[])

    return request(app)
      .get(buildUrl(paths.INTEGRITY_ORDER.EQUIPMENT_HISTORY, { legacySubjectId: 'equipment_details_005' }))
      .expect(res => {
        expect(res.text).toContain('No equipment found')
      })
  })
})
