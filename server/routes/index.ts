import { type RequestHandler, Router } from 'express'
import paths from '../constants/paths'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'

import SearchController from '../controllers/searchController'
import OrderDetailsController from '../controllers/orderDetailsController'
import OrderSummaryController from '../controllers/orderSummaryController'
import EventsController from '../controllers/eventsController'
import SuspensionOfVisitsController from '../controllers/suspensionOfVisitsController'
import EquipmentDetailsController from '../controllers/equipmentDetailsController'
import VisitDetailsController from '../controllers/visitDetailsController'
import CurfewTimetableController from '../controllers/curfewTimetableController'
import ConnectionTestController from '../controllers/connectionTestController'

export default function routes({
  auditService,
  emDatastoreOrderSearchService,
  emDatastoreOrderDetailsService,
  emDatastoreOrderSummaryService,
  emDatastoreEventsService,
  emDatastoreSuspensionOfVisitsService,
  emDatastoreEquipmentDetailsService,
  emDatastoreVisitDetailsService,
  emDatastoreCurfewTimetableService,
  emDatastoreConnectionService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const connectionTestController = new ConnectionTestController(auditService, emDatastoreConnectionService)
  const searchController = new SearchController(auditService, emDatastoreOrderSearchService)
  const orderDetailsController = new OrderDetailsController(auditService, emDatastoreOrderDetailsService)
  const orderSummaryController = new OrderSummaryController(auditService, emDatastoreOrderSummaryService)
  const eventsController = new EventsController(auditService, emDatastoreEventsService)
  const suspensionOfVisitsController = new SuspensionOfVisitsController(
    auditService,
    emDatastoreSuspensionOfVisitsService,
  )
  const equipmentDetailsController = new EquipmentDetailsController(auditService, emDatastoreEquipmentDetailsService)
  const visitDetailsController = new VisitDetailsController(auditService, emDatastoreVisitDetailsService)
  const curfewTimetableController = new CurfewTimetableController(auditService, emDatastoreCurfewTimetableService)

  get(paths.START, async (req, res, next) => {
    await auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get(paths.CONNECTION_TEST, connectionTestController.testConnection)

  get(paths.SEARCH, searchController.searchPage)
  post(paths.SEARCH, searchController.submitSearchQuery)
  get(paths.INTEGRITY_ORDER.INDEX, searchController.searchResultsPage)
  get(paths.ALCOHOL_MONITORING.INDEX, searchController.searchResultsPage)

  get(paths.INTEGRITY_ORDER.SUMMARY, orderSummaryController.orderSummary)
  get(paths.INTEGRITY_ORDER.DETAILS, orderDetailsController.orderDetails)
  get(paths.INTEGRITY_ORDER.EVENT_HISTORY, eventsController.showHistory)
  get(paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS, suspensionOfVisitsController.showSuspensionOfVisits)
  get(paths.INTEGRITY_ORDER.VISIT_DETAILS, visitDetailsController.showVisitDetails)
  get(paths.INTEGRITY_ORDER.EQUIPMENT_DETAILS, equipmentDetailsController.showEquipmentDetails)
  get(paths.INTEGRITY_ORDER.CURFEW_TIMETABLE, curfewTimetableController.showCurfewTimetable)

  return router
}
