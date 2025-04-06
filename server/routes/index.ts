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
import VisitDetailsController from '../controllers/integrity/visitDetailsController'
import CurfewTimetableController from '../controllers/integrity/curfewTimetableController'

// alcohol monitoring orders
import AmSummaryController from '../controllers/alcoholMonitoring/summaryController'
import AmDetailsController from '../controllers/alcoholMonitoring/detailsController'
import AmEquipmentDetailsController from '../controllers/alcoholMonitoring/equipmentDetailsController'

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
  emDatastoreVisitDetailsService,
  emDatastoreCurfewTimetableService,

  alcoholMonitoringSummaryService,
  alcoholMonitoringDetailsService,
  alcoholMonitoringEquipmentDetailsService,
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
  const visitDetailsController = new VisitDetailsController(auditService, emDatastoreVisitDetailsService)
  const curfewTimetableController = new CurfewTimetableController(auditService, emDatastoreCurfewTimetableService)

  // alcohol monitoring
  const amSummaryController = new AmSummaryController(auditService, alcoholMonitoringSummaryService)
  const amDetailsController = new AmDetailsController(auditService, alcoholMonitoringDetailsService)
  const amEquipmentDetailsController = new AmEquipmentDetailsController(
    auditService,
    alcoholMonitoringEquipmentDetailsService,
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
  get(paths.INTEGRITY_ORDER.VISIT_DETAILS, visitDetailsController.showVisitDetails)
  get(paths.INTEGRITY_ORDER.EQUIPMENT_DETAILS, integrityEquipmentDetailsController.showEquipmentDetails)
  get(paths.INTEGRITY_ORDER.CURFEW_TIMETABLE, curfewTimetableController.showCurfewTimetable)

  // alcohol monitoring
  get(paths.ALCOHOL_MONITORING.SUMMARY, amSummaryController.summary)
  get(paths.ALCOHOL_MONITORING.DETAILS, amDetailsController.details)
  get(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, amEquipmentDetailsController.showEquipmentDetails)

  return router
}
