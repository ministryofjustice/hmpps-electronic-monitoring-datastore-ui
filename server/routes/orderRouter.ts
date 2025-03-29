import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import OrderDetailsController from '../controllers/orderDetailsController'
import OrderSummaryController from '../controllers/orderSummaryController'
import EventsController from '../controllers/eventsController'
import SuspensionOfVisitsController from '../controllers/suspensionOfVisitsController'
import EquipmentDetailsController from '../controllers/equipmentDetailsController'
import VisitDetailsController from '../controllers/visitDetailsController'
import CurfewTimetableController from '../controllers/curfewTimetableController'

export default function orderRouter({
  auditService,
  emDatastoreOrderDetailsService,
  emDatastoreOrderSummaryService,
  emDatastoreEventsService: eventsService,
  emDatastoreSuspensionOfVisitsService: suspensionOfVisitsService,
  emDatastoreEquipmentDetailsService: equipmentDetailsService,
  emDatastoreVisitDetailsService: visitDetailsService,
  emDatastoreCurfewTimetableService: curfewTimetableService,
}: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const orderDetailsController = new OrderDetailsController(auditService, emDatastoreOrderDetailsService)
  const orderSummaryController = new OrderSummaryController(auditService, emDatastoreOrderSummaryService)
  const eventsController = new EventsController(auditService, eventsService)
  const suspensionOfVisitsController = new SuspensionOfVisitsController(auditService, suspensionOfVisitsService)
  const equipmentDetailsController = new EquipmentDetailsController(auditService, equipmentDetailsService)
  const visitDetailsController = new VisitDetailsController(auditService, visitDetailsService)
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService)

  get('/orders/:orderId', orderSummaryController.orderSummary)
  get('/orders/:orderId/details', orderDetailsController.orderDetails)
  get('/orders/:orderId/event-history', eventsController.showHistory)
  get('/orders/:orderId/suspension-of-visits', suspensionOfVisitsController.showSuspensionOfVisits)
  get('/orders/:orderId/visit-details', visitDetailsController.showVisitDetails)
  get('/orders/:orderId/equipment-details', equipmentDetailsController.showEquipmentDetails)
  get('/orders/:orderId/curfew-timetable', curfewTimetableController.showCurfewTimetable)

  return router
}
