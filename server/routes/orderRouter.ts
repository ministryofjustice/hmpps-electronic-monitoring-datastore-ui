import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import createTimeline from '../utils/createTimeline'
import createTimelineWithTwoTables from '../utils/createTimelineWithTwoTables'
import getContactHistory from '../data/getContactHistory'
import getCurfewHours from '../data/getCurfewHours'
import getCurfewViolations from '../data/getCurfewViolations'
import getHmuEquipmentDetails from '../data/getHmuEquipmentDetails'
import getDeviceEquipmentDetails from '../data/getDeviceEquipmentDetails'
import getEventHistory from '../data/getEventHistory'
import getOrderDetails from '../data/getOrderDetails'
import getDeviceWearerDetails from '../data/getDeviceWearer'
import getSuspensionOfVisits from '../data/getSuspensionOfVisits'
import tabluateRecords from '../utils/tabulateRecords'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import OldOrderController from './orderController'
import OrderController from '../controllers/orderController'
import getVisitDetails from '../data/getVisitDetails'

export default function orderRouter({ auditService, orderService, datastoreOrderService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const oldOrderController = new OldOrderController(auditService, orderService)
  const orderController = new OrderController(auditService, datastoreOrderService)

  // TODO: Deprecate in favour of /summary
  get('/information', async (req, res, next) => oldOrderController.getSummary(req, res))

  get('/summary', orderController.orderSummary)

  // // Possibly better approach for unit testing
  // get('/summary', async (req, res, next) => {
  //   await auditService.logPageView(Page.ORDER_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

  //   const param1 = req.params.param1WhichIsFake
  //   const param2 = req.params.param2WhichIsFake

  //   try {
  //     let myDataObj = orderController.getSummary(param1, param2)
  //     res.render('page', {data: myDataObj})
  //   } catch (error) {
  //     res.status(500).send('Error fetching data')
  //   }

  // })

  get('/details', async (req, res, next) => {
    await auditService.logPageView(Page.ORDER_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params

      const orderDetails = await getOrderDetails()
      const deviceWearerDetails = await getDeviceWearerDetails()

      const tabulatedOrderDetails = tabluateRecords(orderDetails, 'Order Data')
      const tabulatedDeviceWearerDetails = tabluateRecords(deviceWearerDetails, 'Device Wearer Data')

      res.render('pages/orderDetails', {
        deviceWearer: tabulatedDeviceWearerDetails,
        orderDetails: tabulatedOrderDetails,
        backUrl: `/orders/${orderId}/information`,
      })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/visit-details', async (req, res, next) => {
    await auditService.logPageView(Page.VISIT_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params

      const visitDetails = await getVisitDetails()

      const timeline = createTimelineWithTwoTables(visitDetails, 'Visit details')

      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/equipment-details', async (req, res, next) => {
    await auditService.logPageView(Page.EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const { orderId } = req.params

      // These records come from the same table on the real data but I've separated them out in the mock data for now.
      const hmuEquipmentDetails = await getHmuEquipmentDetails()
      const deviceEquipmentDetails = await getDeviceEquipmentDetails()

      const tabulatedHmuEquipmentDetails = tabluateRecords(hmuEquipmentDetails, 'Equipment details')
      const tabulatedDeviceEquipmentDetails = tabluateRecords(deviceEquipmentDetails, 'Equipment details')

      res.render('pages/equipmentDetails', {
        hmuEquipmentDetails: tabulatedHmuEquipmentDetails,
        deviceEquipmentDetails: tabulatedDeviceEquipmentDetails,
        backUrl: `/orders/${orderId}/information`,
      })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-hours', async (req, res, next) => {
    await auditService.logPageView(Page.CURFEW_HOURS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const curfewHours = await getCurfewHours()
      const tabulatedCurfewHours = tabluateRecords(curfewHours, 'Curfew hours')
      res.render('pages/twoColumnTable', { data: tabulatedCurfewHours, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/event-history', async (req, res, next) => {
    await auditService.logPageView(Page.EVENT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const eventHistory = await getEventHistory()
      const timeline = createTimeline(eventHistory, 'Event history')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

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
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-violations', async (req, res, next) => {
    await auditService.logPageView(Page.CURFEW_VIOLATIONS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const { orderId } = req.params
      const curfewViolations = await getCurfewViolations()
      const timeline = createTimeline(curfewViolations, 'Violations')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/contact-history', async (req, res, next) => {
    await auditService.logPageView(Page.CONTACT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const contactHistory = await getContactHistory()
      const timeline = createTimeline(contactHistory, 'Contact history')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
