import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { type Services } from '../services'
import OrderController from '../controllers/orderController'
import EventsController from '../controllers/eventsController'
import EquipmentDetailsController from '../controllers/equipmentDetailsController'
import VisitDetailsController from '../controllers/visitDetailsController'
import SuspensionOfVisitsController from '../controllers/suspensionOfVisitsController'

export default function orderRouter({
  auditService,
  datastoreOrderService,
  eventsService,
  equipmentDetailsService,
  visitDetailsService,
  suspensionOfVisitsService,
}: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const orderController = new OrderController(auditService, datastoreOrderService)
  const eventsController = new EventsController(auditService, eventsService)
  const equipmentDetailsController = new EquipmentDetailsController(auditService, equipmentDetailsService)
  const visitDetailsController = new VisitDetailsController(auditService, visitDetailsService)
  const suspensionOfVisitsController = new SuspensionOfVisitsController(auditService, suspensionOfVisitsService)

  get('/summary', orderController.orderSummary)
  get('/details', orderController.orderDetails)
  get('/event-history', eventsController.showHistory)
  get('/equipment-details', equipmentDetailsController.showEquipmentDetails)
  get('/visit-details', visitDetailsController.showVisitDetails)
  get('/suspension-of-visits', suspensionOfVisitsController.showSuspensionOfVisits)

  return router
}
