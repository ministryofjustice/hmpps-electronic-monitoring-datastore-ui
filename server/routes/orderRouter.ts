import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import createTimeline from '../utils/createTimeline'
import getSuspensionOfVisits from '../data/getSuspensionOfVisits'
import { type Services } from '../services'
import { Page } from '../services/auditService'
import OrderController from '../controllers/orderController'
import EventsController from '../controllers/eventsController'
import EquipmentDetailsController from '../controllers/equipmentDetailsController'
import VisitDetailsController from '../controllers/visitDetailsController'

export default function orderRouter({
  auditService,
  datastoreOrderService,
  eventsService,
  equipmentDetailsService,
  visitDetailsService,
}: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const orderController = new OrderController(auditService, datastoreOrderService)
  const eventsController = new EventsController(auditService, eventsService)
  const equipmentDetailsController = new EquipmentDetailsController(auditService, equipmentDetailsService)
  const visitDetailsController = new VisitDetailsController(auditService, visitDetailsService)

  get('/summary', orderController.orderSummary)

  get('/details', orderController.orderDetails)
  get('/event-history', eventsController.showHistory)
  get('/equipment-details', equipmentDetailsController.showEquipmentDetails)
  get('/visit-details', visitDetailsController.showVisitDetails)

  get('/suspension-of-visits', async (req, res, next) => {
    await auditService.logPageView(Page.SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const { orderId } = req.params
      const suspensions = await getSuspensionOfVisits()
      const timeline = createTimeline(suspensions, 'Suspension of visits')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
