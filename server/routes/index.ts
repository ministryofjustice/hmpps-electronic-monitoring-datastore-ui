import { type RequestHandler, Router } from 'express'
import paths from '../constants/paths'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Page } from '../services/auditService'

import ConnectionTestController from '../controllers/connectionTestController'
import SearchController from '../controllers/searchController'

// integrity orders
import IntegritySummaryController from '../controllers/integrity/summaryController'
import IntegrityDetailsController from '../controllers/integrity/detailsController'
import EventsController from '../controllers/integrity/eventsController'
import SuspensionOfVisitsController from '../controllers/integrity/suspensionOfVisitsController'
import IntegrityEquipmentDetailsController from '../controllers/integrity/equipmentDetailsController'
import IntegrityVisitDetailsController from '../controllers/integrity/visitDetailsController'
import IntegrityServiceDetailsController from '../controllers/integrity/serviceDetailsController'

// alcohol monitoring orders
import AmSummaryController from '../controllers/alcoholMonitoring/summaryController'
import AmDetailsController from '../controllers/alcoholMonitoring/detailsController'
import AmEquipmentDetailsController from '../controllers/alcoholMonitoring/equipmentDetailsController'
import AmVisitDetailsController from '../controllers/alcoholMonitoring/visitDetailsController'
import AlcoholMonitoringServiceDetailsController from '../controllers/alcoholMonitoring/serviceDetailsController'

import { Services } from '../services'

export default function routes({
  auditService,
  emDatastoreConnectionService,
  emDatastoreOrderSearchService,

  integritySummaryService,
  integrityDetailsService,
  emDatastoreEventsService,
  emDatastoreSuspensionOfVisitsService,
  integrityEquipmentDetailsService,
  integrityVisitDetailsService,
  integrityServiceDetailsService,

  alcoholMonitoringSummaryService,
  alcoholMonitoringDetailsService,
  alcoholMonitoringEquipmentDetailsService,
  alcoholMonitoringVisitDetailsService,
  alcoholMonitoringServiceDetailsService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const connectionTestController = new ConnectionTestController(auditService, emDatastoreConnectionService)
  const searchController = new SearchController(auditService, emDatastoreOrderSearchService)

  // integrity
  const integritySummaryController = new IntegritySummaryController(auditService, integritySummaryService)
  const integrityDetailsController = new IntegrityDetailsController(auditService, integrityDetailsService)
  const eventsController = new EventsController(auditService, emDatastoreEventsService)
  const suspensionOfVisitsController = new SuspensionOfVisitsController(
    auditService,
    emDatastoreSuspensionOfVisitsService,
  )
  const integrityEquipmentDetailsController = new IntegrityEquipmentDetailsController(
    auditService,
    integrityEquipmentDetailsService,
  )
  const integrityVisitDetailsController = new IntegrityVisitDetailsController(
    auditService,
    integrityVisitDetailsService,
  )
  const integrityServiceDetailsController = new IntegrityServiceDetailsController(
    auditService,
    integrityServiceDetailsService,
  )

  // alcohol monitoring
  const amSummaryController = new AmSummaryController(auditService, alcoholMonitoringSummaryService)
  const amDetailsController = new AmDetailsController(auditService, alcoholMonitoringDetailsService)
  const amEquipmentDetailsController = new AmEquipmentDetailsController(
    auditService,
    alcoholMonitoringEquipmentDetailsService,
  )
  const amVisitDetailsController = new AmVisitDetailsController(auditService, alcoholMonitoringVisitDetailsService)
  const amServiceDetailsController = new AlcoholMonitoringServiceDetailsController(
    auditService,
    alcoholMonitoringServiceDetailsService,
  )

  get(paths.START, async (req, res, next) => {
    await auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get(paths.CONNECTION_TEST, connectionTestController.testConnection)

  get(paths.SEARCH, searchController.searchPage)
  post(paths.SEARCH, searchController.submitSearchQuery)
  get(paths.INTEGRITY_ORDER.INDEX, searchController.searchResultsPage)
  get(paths.ALCOHOL_MONITORING.INDEX, searchController.searchResultsPage)

  // integrity
  get(paths.INTEGRITY_ORDER.SUMMARY, integritySummaryController.summary)
  get(paths.INTEGRITY_ORDER.DETAILS, integrityDetailsController.details)
  get(paths.INTEGRITY_ORDER.EVENT_HISTORY, eventsController.showHistory)
  get(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS, suspensionOfVisitsController.showSuspensionOfVisits)
  get(paths.INTEGRITY_ORDER.VISIT_DETAILS, integrityVisitDetailsController.showVisitDetails)
  get(paths.INTEGRITY_ORDER.EQUIPMENT_DETAILS, integrityEquipmentDetailsController.showEquipmentDetails)
  get(paths.INTEGRITY_ORDER.SERVICE_DETAILS, integrityServiceDetailsController.showServiceDetails)

  // alcohol monitoring
  get(paths.ALCOHOL_MONITORING.SUMMARY, amSummaryController.summary)
  get(paths.ALCOHOL_MONITORING.DETAILS, amDetailsController.details)
  get(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, amEquipmentDetailsController.showEquipmentDetails)
  get(paths.ALCOHOL_MONITORING.VISIT_DETAILS, amVisitDetailsController.showVisitDetails)
  get(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, amServiceDetailsController.showServiceDetails)

  return router
}
