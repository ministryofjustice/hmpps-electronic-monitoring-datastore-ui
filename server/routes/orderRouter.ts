import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import OrderController from '../controllers/orderController'
import EventsController from '../controllers/eventsController'
import SuspensionOfVisitsController from '../controllers/suspensionOfVisitsController'
import EquipmentDetailsController from '../controllers/equipmentDetailsController'
import VisitDetailsController from '../controllers/visitDetailsController'
import CurfewTimetableController from '../controllers/curfewTimetableController'

export default function orderRouter({
  auditService,
  datastoreOrderService,
  eventsService,
  suspensionOfVisitsService,
  equipmentDetailsService,
  visitDetailsService,
  curfewTimetableService,
}: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const orderController = new OrderController(auditService, datastoreOrderService)
  const eventsController = new EventsController(auditService, eventsService)
  const suspensionOfVisitsController = new SuspensionOfVisitsController(auditService, suspensionOfVisitsService)
  const equipmentDetailsController = new EquipmentDetailsController(auditService, equipmentDetailsService)
  const visitDetailsController = new VisitDetailsController(auditService, visitDetailsService)
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService)

  get('/summary', orderController.orderSummary)
  get('/details', orderController.orderDetails)
  get('/event-history', eventsController.showHistory)
  get('/suspension-of-visits', suspensionOfVisitsController.showSuspensionOfVisits)
  get('/visit-details', visitDetailsController.showVisitDetails)
  get('/equipment-details', equipmentDetailsController.showEquipmentDetails)
  get('/curfew-timetable', curfewTimetableController.showCurfewTimetable)

  return router
}
