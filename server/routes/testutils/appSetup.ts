import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'

import EmDatastoreConnectionService from '../../services/emDatastoreConnectionService'
import EmDatastoreOrderSearchService from '../../services/emDatastoreOrderSearchService'

import IntegrityOrderDetailsService from '../../services/integrity/orderDetailsService'
import IntegrityEventHistoryService from '../../services/integrity/eventHistoryService'
import IntegritySuspensionOfVisitsService from '../../services/integrity/suspensionOfVisitsService'
import IntegrityEquipmentDetailsService from '../../services/integrity/equipmentDetailsService'
import IntegrityVisitDetailsService from '../../services/integrity/visitDetailsService'
import IntegrityServiceDetailsService from '../../services/integrity/serviceDetailsService'

import AlcoholMonitoringOrderDetailsService from '../../services/alcoholMonitoring/orderDetailsService'
import AlcoholMonitoringEventHistoryService from '../../services/alcoholMonitoring/eventHistoryService'
import AlcoholMonitoringEquipmentDetailsService from '../../services/alcoholMonitoring/equipmentDetailsService'
import AlcoholMonitoringVisitDetailsService from '../../services/alcoholMonitoring/visitDetailsService'
import AlcoholMonitoringServiceDetailsService from '../../services/alcoholMonitoring/serviceDetailsService'

import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import HmppsAuditClient from '../../data/hmppsAuditClient'

jest.mock('../../services/auditService')
jest.mock('../../services/alcoholMonitoring/orderDetailsService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => HmppsUser): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
      cspNonce: '',
      csrfToken: '',
      asset_path: '',
      applicationName: '',
      environmentName: '',
      environmentNameColour: '',
    }
    next()
  })
  app.use((req, _res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>,
    alcoholMonitoringOrderDetailsService: new AlcoholMonitoringOrderDetailsService(
      null,
    ) as jest.Mocked<AlcoholMonitoringOrderDetailsService>,
    emDatastoreConnectionService: new EmDatastoreConnectionService(null) as jest.Mocked<EmDatastoreConnectionService>,
    integrityOrderDetailsService: new IntegrityOrderDetailsService(null) as jest.Mocked<IntegrityOrderDetailsService>,
    emDatastoreOrderSearchService: new EmDatastoreOrderSearchService(
      null,
    ) as jest.Mocked<EmDatastoreOrderSearchService>,
    integrityEventHistoryService: new IntegrityEventHistoryService(null) as jest.Mocked<IntegrityEventHistoryService>,
    alcoholMonitoringEventHistoryService: new AlcoholMonitoringEventHistoryService(
      null,
    ) as jest.Mocked<AlcoholMonitoringEventHistoryService>,
    integritySuspensionOfVisitsService: new IntegritySuspensionOfVisitsService(
      null,
    ) as jest.Mocked<IntegritySuspensionOfVisitsService>,
    integrityEquipmentDetailsService: new IntegrityEquipmentDetailsService(
      null,
    ) as jest.Mocked<IntegrityEquipmentDetailsService>,
    alcoholMonitoringEquipmentDetailsService: new AlcoholMonitoringEquipmentDetailsService(
      null,
    ) as jest.Mocked<AlcoholMonitoringEquipmentDetailsService>,
    integrityVisitDetailsService: new IntegrityVisitDetailsService(null) as jest.Mocked<IntegrityVisitDetailsService>,
    alcoholMonitoringVisitDetailsService: new AlcoholMonitoringVisitDetailsService(
      null,
    ) as jest.Mocked<AlcoholMonitoringVisitDetailsService>,
    integrityServiceDetailsService: new IntegrityServiceDetailsService(
      null,
    ) as jest.Mocked<IntegrityServiceDetailsService>,
    alcoholMonitoringServiceDetailsService: new AlcoholMonitoringServiceDetailsService(
      null,
    ) as jest.Mocked<AlcoholMonitoringServiceDetailsService>,
  },
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(services as Services, production, userSupplier)
}
