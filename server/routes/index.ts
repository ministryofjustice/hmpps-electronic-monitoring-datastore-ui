import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'

import ConnectionTestController from '../controllers/connectionTestController'
import SearchController from '../controllers/searchController'

// integrity orders
import IntegritySummaryController from '../controllers/integrity/summaryController'
import IntegrityOrderDetailsController from '../controllers/integrity/orderDetailsController'
import IntegrityEquipmentDetailsController from '../controllers/integrity/equipmentDetailsController'
import IntegrityVisitDetailsController from '../controllers/integrity/visitDetailsController'
import IntegrityServiceDetailsController from '../controllers/integrity/serviceDetailsController'
import IntegrityEventHistoryController from '../controllers/integrity/eventHistoryController'
import SuspensionOfVisitsController from '../controllers/integrity/suspensionOfVisitsController'

// alcohol monitoring orders
import AmSummaryController from '../controllers/alcoholMonitoring/summaryController'
import AmDetailsController from '../controllers/alcoholMonitoring/detailsController'
import AmEquipmentDetailsController from '../controllers/alcoholMonitoring/equipmentDetailsController'
import AmVisitDetailsController from '../controllers/alcoholMonitoring/visitDetailsController'
import AmServiceDetailsController from '../controllers/alcoholMonitoring/serviceDetailsController'
import AmEventHistoryController from '../controllers/alcoholMonitoring/eventHistoryController'

import paths from '../constants/paths'

export default function routes(services: Services): Router {
  const {
    auditService,
    emDatastoreConnectionService,
    emDatastoreOrderSearchService,

    integrityOrderDetailsService,
    integrityEquipmentDetailsService,
    integrityVisitDetailsService,
    integrityServiceDetailsService,
    integrityEventHistoryService,
    integritySuspensionOfVisitsService,

    alcoholMonitoringOrderDetailsService,
    alcoholMonitoringEquipmentDetailsService,
    alcoholMonitoringVisitDetailsService,
    alcoholMonitoringServiceDetailsService,
    alcoholMonitoringEventHistoryService,
  } = services
  const router = Router()

  const connectionTestController = new ConnectionTestController(auditService, emDatastoreConnectionService)
  const searchController = new SearchController(auditService, emDatastoreOrderSearchService)

  // integrity
  const integritySummaryController = new IntegritySummaryController(auditService, integrityOrderDetailsService)
  const integrityDetailsController = new IntegrityOrderDetailsController(auditService, integrityOrderDetailsService)
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
  const integrityEventHistoryController = new IntegrityEventHistoryController(
    auditService,
    integrityEventHistoryService,
  )
  const suspensionOfVisitsController = new SuspensionOfVisitsController(
    auditService,
    integritySuspensionOfVisitsService,
  )

  // alcohol monitoring
  const amSummaryController = new AmSummaryController(auditService, alcoholMonitoringOrderDetailsService)
  const amDetailsController = new AmDetailsController(auditService, alcoholMonitoringOrderDetailsService)
  const amEquipmentDetailsController = new AmEquipmentDetailsController(
    auditService,
    alcoholMonitoringEquipmentDetailsService,
  )
  const amVisitDetailsController = new AmVisitDetailsController(auditService, alcoholMonitoringVisitDetailsService)
  const amServiceDetailsController = new AmServiceDetailsController(
    auditService,
    alcoholMonitoringServiceDetailsService,
  )
  const amEventHistoryController = new AmEventHistoryController(auditService, alcoholMonitoringEventHistoryService)

  router.get(paths.START, async (req, res, next) => {
    await auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  router.get(paths.CONNECTION_TEST, connectionTestController.testConnection)

  router.get(paths.SEARCH, searchController.searchPage)
  router.post(paths.SEARCH, searchController.submitSearchQuery)

  // integrity
  router.get(paths.INTEGRITY_ORDER.INDEX, integrityDetailsController.searchResults)
  router.get(paths.INTEGRITY_ORDER.SUMMARY, integritySummaryController.summary)
  router.get(paths.INTEGRITY_ORDER.DETAILS, integrityDetailsController.details)
  router.get(paths.INTEGRITY_ORDER.VISIT_DETAILS, integrityVisitDetailsController.showVisitDetails)
  router.get(paths.INTEGRITY_ORDER.EQUIPMENT_DETAILS, integrityEquipmentDetailsController.showEquipmentDetails)
  router.get(paths.INTEGRITY_ORDER.SERVICE_DETAILS, integrityServiceDetailsController.showServiceDetails)
  router.get(paths.INTEGRITY_ORDER.EVENT_HISTORY, integrityEventHistoryController.showEventHistory)
  router.get(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS, suspensionOfVisitsController.showSuspensionOfVisits)

  // alcohol monitoring
  router.get(paths.ALCOHOL_MONITORING.INDEX, amDetailsController.searchResults)
  router.get(paths.ALCOHOL_MONITORING.SUMMARY, amSummaryController.summary)
  router.get(paths.ALCOHOL_MONITORING.DETAILS, amDetailsController.details)
  router.get(paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS, amEquipmentDetailsController.showEquipmentDetails)
  router.get(paths.ALCOHOL_MONITORING.VISIT_DETAILS, amVisitDetailsController.showVisitDetails)
  router.get(paths.ALCOHOL_MONITORING.SERVICE_DETAILS, amServiceDetailsController.showServiceDetails)
  router.get(paths.ALCOHOL_MONITORING.EVENT_HISTORY, amEventHistoryController.showEventHistory)

  return router
}
